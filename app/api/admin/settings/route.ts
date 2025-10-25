/**
 * CR AudioViz AI - Admin Settings API Route
 * Manages user profile, preferences, and security settings
 * @timestamp October 25, 2025 - 3:52 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface UserSettings {
  profile: {
    email: string;
    fullName: string;
    company?: string;
    timezone: string;
    language: string;
    avatarUrl?: string;
  };
  preferences: {
    emailNotifications: boolean;
    marketingEmails: boolean;
    productUpdates: boolean;
    weeklyDigest: boolean;
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange?: string;
    activeSessions: number;
  };
  api: {
    apiKey?: string;
    apiKeysCount: number;
    lastApiCall?: string;
  };
}

/**
 * GET /api/admin/settings
 * Retrieve all user settings and preferences
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Fetch user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (prefsError) {
      console.error('Error fetching preferences:', prefsError);
    }

    // Fetch API keys count
    const { count: apiKeysCount } = await supabase
      .from('api_keys')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Fetch last API call
    const { data: lastApiCall } = await supabase
      .from('api_usage')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Count active sessions
    const { count: activeSessions } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true);

    const settings: UserSettings = {
      profile: {
        email: user.email || '',
        fullName: profile?.full_name || '',
        company: profile?.company || undefined,
        timezone: profile?.timezone || 'America/New_York',
        language: profile?.language || 'en',
        avatarUrl: profile?.avatar_url || undefined
      },
      preferences: {
        emailNotifications: preferences?.email_notifications ?? true,
        marketingEmails: preferences?.marketing_emails ?? false,
        productUpdates: preferences?.product_updates ?? true,
        weeklyDigest: preferences?.weekly_digest ?? false,
        theme: preferences?.theme || 'system',
        compactMode: preferences?.compact_mode ?? false
      },
      security: {
        twoFactorEnabled: profile?.two_factor_enabled ?? false,
        lastPasswordChange: profile?.last_password_change || undefined,
        activeSessions: activeSessions || 0
      },
      api: {
        apiKey: profile?.api_key || undefined,
        apiKeysCount: apiKeysCount || 0,
        lastApiCall: lastApiCall?.created_at || undefined
      }
    };

    return NextResponse.json(settings);

  } catch (error) {
    console.error('Admin settings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/settings
 * Update user settings and preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: section and data' },
        { status: 400 }
      );
    }

    switch (section) {
      case 'profile': {
        const { fullName, company, timezone, language } = data;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            company: company || null,
            timezone: timezone,
            language: language,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Profile update error:', updateError);
          return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Profile updated successfully'
        });
      }

      case 'preferences': {
        const { 
          emailNotifications, 
          marketingEmails, 
          productUpdates, 
          weeklyDigest,
          theme,
          compactMode
        } = data;

        // Upsert preferences
        const { error: upsertError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            email_notifications: emailNotifications,
            marketing_emails: marketingEmails,
            product_updates: productUpdates,
            weekly_digest: weeklyDigest,
            theme: theme,
            compact_mode: compactMode,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (upsertError) {
          console.error('Preferences update error:', upsertError);
          return NextResponse.json(
            { error: 'Failed to update preferences' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Preferences updated successfully'
        });
      }

      case 'security': {
        const { action, ...params } = data;

        switch (action) {
          case 'enable_2fa': {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                two_factor_enabled: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id);

            if (updateError) {
              return NextResponse.json(
                { error: 'Failed to enable 2FA' },
                { status: 500 }
              );
            }

            return NextResponse.json({
              success: true,
              message: 'Two-factor authentication enabled'
            });
          }

          case 'disable_2fa': {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                two_factor_enabled: false,
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id);

            if (updateError) {
              return NextResponse.json(
                { error: 'Failed to disable 2FA' },
                { status: 500 }
              );
            }

            return NextResponse.json({
              success: true,
              message: 'Two-factor authentication disabled'
            });
          }

          case 'change_password': {
            const { currentPassword, newPassword } = params;

            if (!currentPassword || !newPassword) {
              return NextResponse.json(
                { error: 'Current and new password required' },
                { status: 400 }
              );
            }

            // Use Supabase auth to update password
            const { error: passwordError } = await supabase.auth.updateUser({
              password: newPassword
            });

            if (passwordError) {
              return NextResponse.json(
                { error: 'Failed to change password' },
                { status: 400 }
              );
            }

            // Update last password change timestamp
            await supabase
              .from('profiles')
              .update({
                last_password_change: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id);

            return NextResponse.json({
              success: true,
              message: 'Password changed successfully'
            });
          }

          case 'revoke_sessions': {
            // Mark all other sessions as inactive
            const { error: revokeError } = await supabase
              .from('user_sessions')
              .update({
                is_active: false,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', user.id)
              .neq('session_id', params.currentSessionId);

            if (revokeError) {
              return NextResponse.json(
                { error: 'Failed to revoke sessions' },
                { status: 500 }
              );
            }

            return NextResponse.json({
              success: true,
              message: 'All other sessions revoked'
            });
          }

          default:
            return NextResponse.json(
              { error: 'Invalid security action' },
              { status: 400 }
            );
        }
      }

      case 'api': {
        const { action } = data;

        switch (action) {
          case 'generate_key': {
            // Generate new API key
            const apiKey = `crav_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
            
            const { error: insertError } = await supabase
              .from('api_keys')
              .insert({
                user_id: user.id,
                key: apiKey,
                name: data.name || 'API Key',
                is_active: true,
                created_at: new Date().toISOString()
              });

            if (insertError) {
              return NextResponse.json(
                { error: 'Failed to generate API key' },
                { status: 500 }
              );
            }

            return NextResponse.json({
              success: true,
              apiKey: apiKey,
              message: 'API key generated successfully'
            });
          }

          case 'revoke_key': {
            const { keyId } = data;

            if (!keyId) {
              return NextResponse.json(
                { error: 'Key ID required' },
                { status: 400 }
              );
            }

            const { error: revokeError } = await supabase
              .from('api_keys')
              .update({
                is_active: false,
                updated_at: new Date().toISOString()
              })
              .eq('id', keyId)
              .eq('user_id', user.id);

            if (revokeError) {
              return NextResponse.json(
                { error: 'Failed to revoke API key' },
                { status: 500 }
              );
            }

            return NextResponse.json({
              success: true,
              message: 'API key revoked successfully'
            });
          }

          default:
            return NextResponse.json(
              { error: 'Invalid API action' },
              { status: 400 }
            );
        }
      }

      default:
        return NextResponse.json(
          { error: 'Invalid settings section' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin settings PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/settings
 * Delete user account and all associated data
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { confirmation } = body;

    if (confirmation !== user.email) {
      return NextResponse.json(
        { error: 'Email confirmation does not match' },
        { status: 400 }
      );
    }

    // Soft delete - mark account as deleted
    const { error: deleteError } = await supabase
      .from('profiles')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (deleteError) {
      console.error('Account deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    // Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Admin settings DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
