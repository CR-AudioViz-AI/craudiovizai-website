import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

/**
 * Admin Settings Management API
 * 
 * GET: Get user profile and preferences
 * POST: Update profile, password, preferences, API keys
 * 
 * Session: 2025-10-25 19:00 EST
 */

async function getSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

async function verifyAuth() {
  const supabase = await getSupabaseClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

/**
 * GET /api/admin/settings
 * Returns user settings and preferences
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const supabase = await getSupabaseClient();

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    // Get user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (prefsError && prefsError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching preferences:', prefsError);
    }

    // Get API keys (mask the actual keys)
    const { data: apiKeys, error: keysError } = await supabase
      .from('user_api_keys')
      .select('id, key_name, key_prefix, created_at, last_used, is_active')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (keysError) {
      console.error('Error fetching API keys:', keysError);
    }

    // Get notification settings
    const { data: notifications, error: notifError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (notifError && notifError.code !== 'PGRST116') {
      console.error('Error fetching notification settings:', notifError);
    }

    // Prepare safe profile data (remove sensitive fields)
    const safeProfile = {
      ...profile,
      stripe_customer_id: undefined, // Don't expose Stripe IDs
      stripe_subscription_id: undefined,
    };

    return NextResponse.json({
      success: true,
      data: {
        profile: safeProfile,
        preferences: preferences || {
          theme: 'light',
          language: 'en',
          timezone: 'America/New_York',
          notifications_enabled: true,
        },
        api_keys: apiKeys || [],
        notifications: notifications || {
          email_enabled: true,
          push_enabled: false,
          credits_low_alert: true,
          subscription_updates: true,
          new_features: true,
        },
        security: {
          two_factor_enabled: profile?.two_factor_enabled || false,
          last_password_change: profile?.last_password_change || null,
          active_sessions: 1, // TODO: Implement session tracking
        },
        user_id: user.id,
      },
    });

  } catch (error) {
    console.error('Error in /api/admin/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/settings
 * Update user settings
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    const supabase = await getSupabaseClient();

    switch (action) {
      case 'update_profile':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing profile data' },
            { status: 400 }
          );
        }

        // Update allowed profile fields
        const allowedFields = ['full_name', 'company', 'phone', 'avatar_url', 'bio'];
        const updateData: Record<string, any> = {};

        allowedFields.forEach(field => {
          if (data[field] !== undefined) {
            updateData[field] = data[field];
          }
        });

        if (Object.keys(updateData).length === 0) {
          return NextResponse.json(
            { error: 'No valid fields to update' },
            { status: 400 }
          );
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Profile updated successfully',
        });

      case 'update_email':
        if (!data.new_email) {
          return NextResponse.json(
            { error: 'Missing new_email' },
            { status: 400 }
          );
        }

        // Update email via Supabase Auth
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.new_email,
        });

        if (emailError) {
          console.error('Error updating email:', emailError);
          return NextResponse.json(
            { error: 'Failed to update email' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Confirmation email sent to new address',
        });

      case 'update_password':
        if (!data.current_password || !data.new_password) {
          return NextResponse.json(
            { error: 'Missing current_password or new_password' },
            { status: 400 }
          );
        }

        // Validate new password strength
        if (data.new_password.length < 8) {
          return NextResponse.json(
            { error: 'Password must be at least 8 characters' },
            { status: 400 }
          );
        }

        // Update password via Supabase Auth
        const { error: passwordError } = await supabase.auth.updateUser({
          password: data.new_password,
        });

        if (passwordError) {
          console.error('Error updating password:', passwordError);
          return NextResponse.json(
            { error: 'Failed to update password' },
            { status: 500 }
          );
        }

        // Update last password change timestamp
        await supabase
          .from('profiles')
          .update({ last_password_change: new Date().toISOString() })
          .eq('id', user.id);

        return NextResponse.json({
          success: true,
          message: 'Password updated successfully',
        });

      case 'update_preferences':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing preferences data' },
            { status: 400 }
          );
        }

        // Upsert preferences
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            ...data,
            updated_at: new Date().toISOString(),
          });

        if (prefsError) {
          console.error('Error updating preferences:', prefsError);
          return NextResponse.json(
            { error: 'Failed to update preferences' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Preferences updated successfully',
        });

      case 'update_notifications':
        if (!data) {
          return NextResponse.json(
            { error: 'Missing notification settings' },
            { status: 400 }
          );
        }

        // Upsert notification settings
        const { error: notifError } = await supabase
          .from('notification_settings')
          .upsert({
            user_id: user.id,
            ...data,
            updated_at: new Date().toISOString(),
          });

        if (notifError) {
          console.error('Error updating notifications:', notifError);
          return NextResponse.json(
            { error: 'Failed to update notification settings' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Notification settings updated successfully',
        });

      case 'generate_api_key':
        if (!data.key_name) {
          return NextResponse.json(
            { error: 'Missing key_name' },
            { status: 400 }
          );
        }

        // Generate new API key
        const apiKey = `crav_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        const keyPrefix = apiKey.substring(0, 12);

        // Hash the key before storing
        const hashedKey = await bcrypt.hash(apiKey, 10);

        // Store hashed key
        const { data: newKey, error: keyError } = await supabase
          .from('user_api_keys')
          .insert({
            user_id: user.id,
            key_name: data.key_name,
            key_hash: hashedKey,
            key_prefix: keyPrefix,
            is_active: true,
          })
          .select()
          .single();

        if (keyError) {
          console.error('Error generating API key:', keyError);
          return NextResponse.json(
            { error: 'Failed to generate API key' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'API key generated successfully',
          api_key: apiKey, // Only show once!
          key_id: newKey.id,
          warning: 'Save this key now - it will not be shown again',
        });

      case 'revoke_api_key':
        if (!data.key_id) {
          return NextResponse.json(
            { error: 'Missing key_id' },
            { status: 400 }
          );
        }

        // Deactivate API key
        const { error: revokeError } = await supabase
          .from('user_api_keys')
          .update({ is_active: false })
          .eq('id', data.key_id)
          .eq('user_id', user.id);

        if (revokeError) {
          console.error('Error revoking API key:', revokeError);
          return NextResponse.json(
            { error: 'Failed to revoke API key' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'API key revoked successfully',
        });

      case 'enable_2fa':
        // TODO: Implement 2FA setup with TOTP
        return NextResponse.json({
          success: false,
          message: '2FA setup coming soon',
        });

      case 'disable_2fa':
        // TODO: Implement 2FA disable
        return NextResponse.json({
          success: false,
          message: '2FA disable coming soon',
        });

      case 'delete_account':
        // Soft delete - mark account for deletion
        const { error: deleteError } = await supabase
          .from('profiles')
          .update({
            account_status: 'pending_deletion',
            deletion_requested_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (deleteError) {
          console.error('Error marking account for deletion:', deleteError);
          return NextResponse.json(
            { error: 'Failed to process account deletion' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Account marked for deletion. You have 30 days to cancel.',
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in POST /api/admin/settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
