/**
 * UNIVERSAL MARKETING DISTRIBUTION API
 * Handles posting content to all selected social platforms
 * Created: Saturday, November 01, 2025 - 2:48 PM ET
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Platform-specific posting functions
import { postToTwitter } from '@/lib/platforms/twitter';
import { postToLinkedIn } from '@/lib/platforms/linkedin';
import { postToFacebook } from '@/lib/platforms/facebook';
import { postToInstagram } from '@/lib/platforms/instagram';
import { postToTikTok } from '@/lib/platforms/tiktok';
import { postToYouTube } from '@/lib/platforms/youtube';
import { postToPinterest } from '@/lib/platforms/pinterest';
import { postToReddit } from '@/lib/platforms/reddit';
import { postToDiscord } from '@/lib/platforms/discord';
import { postToTelegram } from '@/lib/platforms/telegram';
import { postToMastodon } from '@/lib/platforms/mastodon';
import { postToThreads } from '@/lib/platforms/threads';

interface DistributionRequest {
  content: string;
  title?: string;
  media_urls: string[];
  platform_variations: Record<string, string>;
  distribution_mode: 'accounts' | 'groups' | 'platforms' | 'preset';
  selected_accounts?: string[];
  selected_groups?: string[];
  selected_platforms?: string[];
  preset_id?: string;
  schedule_mode: 'now' | 'later';
  scheduled_for?: string;
}

const PLATFORM_POSTERS: Record<string, Function> = {
  twitter: postToTwitter,
  linkedin: postToLinkedIn,
  facebook: postToFacebook,
  instagram: postToInstagram,
  tiktok: postToTikTok,
  youtube: postToYouTube,
  pinterest: postToPinterest,
  reddit: postToReddit,
  discord: postToDiscord,
  telegram: postToTelegram,
  mastodon: postToMastodon,
  threads: postToThreads,
};

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body: DistributionRequest = await request.json();
    
    // Validate request
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }
    
    // STEP 1: Resolve target accounts
    const targetAccountIds = await resolveTargetAccounts(
      supabase,
      user.id,
      body
    );
    
    if (targetAccountIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No target accounts selected' },
        { status: 400 }
      );
    }
    
    // STEP 2: Create content draft
    const { data: contentDraft, error: draftError } = await supabase
      .from('content_drafts')
      .insert({
        user_id: user.id,
        title: body.title,
        content: body.content,
        media_urls: body.media_urls,
        platform_variations: body.platform_variations,
        status: body.schedule_mode === 'now' ? 'published' : 'scheduled',
      })
      .select()
      .single();
    
    if (draftError || !contentDraft) {
      console.error('Error creating content draft:', draftError);
      return NextResponse.json(
        { success: false, error: 'Failed to create content draft' },
        { status: 500 }
      );
    }
    
    // STEP 3: Create distribution plan
    const scheduledFor = body.schedule_mode === 'later' && body.scheduled_for
      ? new Date(body.scheduled_for).toISOString()
      : null;
    
    const { data: distributionPlan, error: planError } = await supabase
      .from('distribution_plans')
      .insert({
        content_draft_id: contentDraft.id,
        user_id: user.id,
        selected_accounts: targetAccountIds,
        selected_groups: body.selected_groups || [],
        selected_platforms: body.selected_platforms || [],
        distribution_preset_id: body.preset_id,
        targeting_mode: body.distribution_mode,
        scheduled_for: scheduledFor,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status: body.schedule_mode === 'now' ? 'processing' : 'pending',
        total_accounts: targetAccountIds.length,
      })
      .select()
      .single();
    
    if (planError || !distributionPlan) {
      console.error('Error creating distribution plan:', planError);
      return NextResponse.json(
        { success: false, error: 'Failed to create distribution plan' },
        { status: 500 }
      );
    }
    
    // STEP 4: Create published_posts records for each account
    const publishedPostsData = targetAccountIds.map(accountId => ({
      distribution_plan_id: distributionPlan.id,
      content_draft_id: contentDraft.id,
      connected_account_id: accountId,
      user_id: user.id,
      scheduled_for: scheduledFor,
      status: 'pending' as const,
    }));
    
    const { data: publishedPosts, error: postsError } = await supabase
      .from('published_posts')
      .insert(publishedPostsData)
      .select();
    
    if (postsError || !publishedPosts) {
      console.error('Error creating published posts:', postsError);
      return NextResponse.json(
        { success: false, error: 'Failed to create post records' },
        { status: 500 }
      );
    }
    
    // STEP 5: If posting now, add to queue
    if (body.schedule_mode === 'now') {
      const queueData = publishedPosts.map(post => ({
        distribution_plan_id: distributionPlan.id,
        published_post_id: post.id,
        scheduled_for: new Date().toISOString(),
        priority: 5,
        status: 'queued' as const,
      }));
      
      const { error: queueError } = await supabase
        .from('post_queue')
        .insert(queueData);
      
      if (queueError) {
        console.error('Error adding to queue:', queueError);
      }
      
      // STEP 6: Start posting immediately (background process)
      processDistribution(distributionPlan.id, user.id).catch(console.error);
    }
    
    return NextResponse.json({
      success: true,
      distribution_plan_id: distributionPlan.id,
      content_draft_id: contentDraft.id,
      total_accounts: targetAccountIds.length,
      scheduled_for: scheduledFor,
      status: body.schedule_mode === 'now' ? 'posting' : 'scheduled',
    });
    
  } catch (error) {
    console.error('Distribution error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Resolve target accounts based on selection mode
 */
async function resolveTargetAccounts(
  supabase: any,
  userId: string,
  body: DistributionRequest
): Promise<string[]> {
  const accountIds = new Set<string>();
  
  // Direct account selection
  if (body.selected_accounts && body.selected_accounts.length > 0) {
    body.selected_accounts.forEach(id => accountIds.add(id));
  }
  
  // Group selection
  if (body.selected_groups && body.selected_groups.length > 0) {
    const { data: groupAccounts } = await supabase
      .from('account_group_memberships')
      .select('connected_account_id')
      .in('group_id', body.selected_groups);
    
    groupAccounts?.forEach((row: any) => accountIds.add(row.connected_account_id));
  }
  
  // Platform selection
  if (body.selected_platforms && body.selected_platforms.length > 0) {
    const { data: platformAccounts } = await supabase
      .from('connected_accounts')
      .select('id')
      .eq('user_id', userId)
      .in('platform_type', body.selected_platforms)
      .eq('status', 'active');
    
    platformAccounts?.forEach((row: any) => accountIds.add(row.id));
  }
  
  // Preset selection
  if (body.preset_id) {
    const { data: preset } = await supabase
      .from('distribution_presets')
      .select('*')
      .eq('id', body.preset_id)
      .eq('user_id', userId)
      .single();
    
    if (preset) {
      // Use the helper function to resolve preset targets
      const { data: presetAccounts } = await supabase
        .rpc('resolve_distribution_targets', {
          user_id_param: userId,
          preset_id_param: preset.id,
        });
      
      presetAccounts?.forEach((row: any) => accountIds.add(row.account_id));
    }
  }
  
  return Array.from(accountIds);
}

/**
 * Process distribution - post to all platforms
 */
async function processDistribution(distributionPlanId: string, userId: string) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Get distribution plan
    const { data: plan } = await supabase
      .from('distribution_plans')
      .select(`
        *,
        content_drafts (*),
        published_posts (*)
      `)
      .eq('id', distributionPlanId)
      .single();
    
    if (!plan) {
      console.error('Distribution plan not found');
      return;
    }
    
    const contentDraft = plan.content_drafts;
    const posts = plan.published_posts;
    
    let successCount = 0;
    let failCount = 0;
    
    // Process each post
    for (const post of posts) {
      try {
        // Get account details
        const { data: account } = await supabase
          .from('connected_accounts')
          .select('*')
          .eq('id', post.connected_account_id)
          .single();
        
        if (!account || account.status !== 'active') {
          throw new Error('Account not active');
        }
        
        // Get platform-specific content
        const platformContent = contentDraft.platform_variations[account.platform_type]
          || contentDraft.content;
        
        // Get platform poster function
        const posterFunction = PLATFORM_POSTERS[account.platform_type];
        if (!posterFunction) {
          throw new Error(`No poster function for platform: ${account.platform_type}`);
        }
        
        // Update post status to processing
        await supabase
          .from('published_posts')
          .update({ status: 'processing' })
          .eq('id', post.id);
        
        // Post to platform
        const result = await posterFunction({
          content: platformContent,
          media_urls: contentDraft.media_urls,
          access_token: account.access_token,
          account,
        });
        
        // Update post with success
        await supabase
          .from('published_posts')
          .update({
            status: 'posted',
            platform_post_id: result.post_id,
            platform_url: result.url,
            posted_content: platformContent,
            posted_at: new Date().toISOString(),
          })
          .eq('id', post.id);
        
        successCount++;
        
      } catch (error) {
        console.error(`Error posting to ${post.connected_account_id}:`, error);
        
        // Update post with failure
        await supabase
          .from('published_posts')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          })
          .eq('id', post.id);
        
        failCount++;
      }
    }
    
    // Update distribution plan status
    await supabase
      .from('distribution_plans')
      .update({
        status: failCount === 0 ? 'completed' : (successCount > 0 ? 'partial' : 'failed'),
        successful_posts: successCount,
        failed_posts: failCount,
      })
      .eq('id', distributionPlanId);
    
    console.log(`Distribution complete: ${successCount} succeeded, ${failCount} failed`);
    
  } catch (error) {
    console.error('Error processing distribution:', error);
    
    // Update plan status to failed
    await supabase
      .from('distribution_plans')
      .update({ status: 'failed' })
      .eq('id', distributionPlanId);
  }
}

// Export for use by cron jobs/scheduled tasks
export { processDistribution };
