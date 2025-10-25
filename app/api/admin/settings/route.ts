// CR AUDIOVIZ AI - Admin Settings API Route
// Session: 2025-10-25 - Phase 3 API Routes
// Purpose: Manage user profile, preferences, security, and account settings

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET: Fetch user settings and profile
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section'); // profile, preferences, security, notifications

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Failed to fetch profile', details: profileError?.message },
        { status: 500 }
      );
    }

    const response: any = {
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url,
        company: profile.company,
        website: profile.website,
        bio: profile.bio,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    };

    // Add section-specific data
    if (!section || section === 'preferences') {
      response.preferences = {
        theme: profile.theme || 'system',
        language: profile.language || 'en',
        timezone: profile.timezone || 'UTC',
        emailNotifications: profile.email_notifications !== false,
        marketingEmails: profile.marketing_emails || false,
        defaultCreditsPerGeneration: profile.default_credits_per_generation || 10
      };
    }

    if (!section || section === 'security') {
      // Get auth methods
      const { data: { user } } = await supabase.auth.getUser();
      
      response.security = {
        email: user?.email,
        emailVerified: user?.email_confirmed_at ? true : false,
        phoneVerified: user?.phone_confirmed_at ? true : false,
        twoFactorEnabled: profile.two_factor_enabled || false,
        lastPasswordChange: profile.last_password_change,
        providers: user?.app_metadata?.providers || []
      };
    }

    if (!section || section === 'notifications') {
      response.notifications = {
        email: {
          enabled: profile.email_notifications !== false,
          creditLowWarning: profile.notify_credit_low || true,
          generationComplete: profile.notify_generation_complete !== false,
          weeklyReport: profile.notify_weekly_report || false,
          productUpdates: profile.notify_product_updates || true
        },
        push: {
          enabled: profile.push_notifications || false
        }
      };
    }

    if (!section || section === 'api') {
      // Get API keys (if user has any)
      const { data: apiKeys } = await supabase
        .from('api_keys')
        .select('id, name, key_prefix, created_at, last_used_at, expires_at')
        .eq('user_id', userId)
        .eq('is_active', true);

      response.apiKeys = apiKeys || [];
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Admin Settings API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Update user settings
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { action, section, data } = body;

    if (action === 'update_profile') {
      // Update profile information
      const allowedFields = [
        'full_name',
        'display_name',
        'avatar_url',
        'company',
        'website',
        'bio'
      ];

      const updates: any = {
        updated_at: new Date().toISOString()
      };

      // Filter and add allowed fields
      Object.keys(data).forEach(key => {
        if (allowedFields.includes(key)) {
          updates[key] = data[key];
        }
      });

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update profile', details: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        profile: updatedProfile
      });
    }

    if (action === 'update_preferences') {
      // Update user preferences
      const allowedFields = [
        'theme',
        'language',
        'timezone',
        'email_notifications',
        'marketing_emails',
        'default_credits_per_generation'
      ];

      const updates: any = {
        updated_at: new Date().toISOString()
      };

      Object.keys(data).forEach(key => {
        if (allowedFields.includes(key)) {
          updates[key] = data[key];
        }
      });

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update preferences', details: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        preferences: updatedProfile
      });
    }

    if (action === 'update_notifications') {
      // Update notification preferences
      const allowedFields = [
        'email_notifications',
        'push_notifications',
        'notify_credit_low',
        'notify_generation_complete',
        'notify_weekly_report',
        'notify_product_updates'
      ];

      const updates: any = {
        updated_at: new Date().toISOString()
      };

      Object.keys(data).forEach(key => {
        if (allowedFields.includes(key)) {
          updates[key] = data[key];
        }
      });

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update notification settings', details: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Notification settings updated'
      });
    }

    if (action === 'change_password') {
      // Change user password
      const { currentPassword, newPassword } = data;

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: 'Missing currentPassword or newPassword' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }

      // Update password via Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) {
        return NextResponse.json(
          { error: 'Failed to change password', details: passwordError.message },
          { status: 500 }
        );
      }

      // Update last password change timestamp
      await supabase
        .from('profiles')
        .update({
          last_password_change: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      return NextResponse.json({
        success: true,
        message: 'Password changed successfully'
      });
    }

    if (action === 'change_email') {
      // Request email change
      const { newEmail } = data;

      if (!newEmail) {
        return NextResponse.json(
          { error: 'Missing newEmail' },
          { status: 400 }
        );
      }

      const { error: emailError } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (emailError) {
        return NextResponse.json(
          { error: 'Failed to change email', details: emailError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Verification email sent to new address'
      });
    }

    if (action === 'create_api_key') {
      // Create new API key
      const { name, expiresInDays } = data;

      if (!name) {
        return NextResponse.json(
          { error: 'Missing API key name' },
          { status: 400 }
        );
      }

      // Generate API key
      const apiKey = 'crav_' + Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15) +
                     Math.random().toString(36).substring(2, 15);
      
      const keyPrefix = apiKey.substring(0, 12);

      let expiresAt = null;
      if (expiresInDays) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiresInDays);
        expiresAt = expiryDate.toISOString();
      }

      // Store in database (hash the full key in production)
      const { data: newKey, error: keyError } = await supabase
        .from('api_keys')
        .insert({
          user_id: userId,
          name,
          api_key: apiKey, // In production, store hashed version
          key_prefix: keyPrefix,
          is_active: true,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        })
        .select('id, name, key_prefix, created_at, expires_at')
        .single();

      if (keyError) {
        return NextResponse.json(
          { error: 'Failed to create API key', details: keyError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        apiKey, // Only shown once
        keyInfo: newKey,
        warning: 'Save this key securely. It will not be shown again.'
      });
    }

    if (action === 'delete_api_key') {
      // Delete API key
      const { keyId } = data;

      if (!keyId) {
        return NextResponse.json(
          { error: 'Missing keyId' },
          { status: 400 }
        );
      }

      const { error: deleteError } = await supabase
        .from('api_keys')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString()
        })
        .eq('id', keyId)
        .eq('user_id', userId);

      if (deleteError) {
        return NextResponse.json(
          { error: 'Failed to delete API key', details: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'API key deleted successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Admin Settings API POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete user account
export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');

    if (confirm !== 'DELETE_MY_ACCOUNT') {
      return NextResponse.json(
        { error: 'Account deletion requires confirmation' },
        { status: 400 }
      );
    }

    // Mark profile as deleted (soft delete)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        email: `deleted_${userId}@craudiovizai.com`
      })
      .eq('id', userId);

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to delete account', details: profileError.message },
        { status: 500 }
      );
    }

    // Sign out user
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error: any) {
    console.error('Admin Settings API DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
