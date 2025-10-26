/**
 * CR AudioViz AI - Admin Javari AI API Route
 * Manages Javari AI assistant configuration and settings
 * @timestamp October 25, 2025 - 3:54 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface JavariConfig {
  model: {
    name: string;
    version: string;
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  behavior: {
    personality: 'professional' | 'casual' | 'creative' | 'technical';
    verbosity: 'concise' | 'balanced' | 'detailed';
    responseStyle: 'direct' | 'conversational' | 'educational';
    includeExamples: boolean;
    includeExplanations: boolean;
  };
  features: {
    webSearch: boolean;
    codeExecution: boolean;
    imageGeneration: boolean;
    voiceResponse: boolean;
    multimodal: boolean;
  };
  limits: {
    dailyRequests: number;
    maxContextLength: number;
    maxResponseLength: number;
    rateLimitPerMinute: number;
  };
  integrations: {
    stripe: boolean;
    supabase: boolean;
    openai: boolean;
    vercel: boolean;
  };
  usage: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    lastUsed?: string;
  };
}

/**
 * GET /api/admin/javari
 * Retrieve Javari AI configuration and usage statistics
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch Javari configuration for user
    const { data: config, error: configError } = await supabase
      .from('javari_config')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (configError && configError.code !== 'PGRST116') {
      console.error('Error fetching Javari config:', configError);
    }

    // Fetch usage statistics
    const { data: usageStats } = await supabase
      .from('javari_usage')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1000);

    const totalRequests = usageStats?.length || 0;
    const successfulRequests = usageStats?.filter(u => u.status === 'success').length || 0;
    const failedRequests = usageStats?.filter(u => u.status === 'error').length || 0;
    
    const avgResponseTime = usageStats && usageStats.length > 0
      ? usageStats.reduce((acc, u) => acc + (u.response_time || 0), 0) / usageStats.length
      : 0;

    const lastUsed = usageStats && usageStats.length > 0
      ? usageStats[0].created_at
      : undefined;

    const javariConfig: JavariConfig = {
      model: {
        name: config?.model_name || 'gpt-4-turbo',
        version: config?.model_version || '2024-04-09',
        temperature: config?.temperature ?? 0.7,
        maxTokens: config?.max_tokens || 2000,
        topP: config?.top_p ?? 1.0
      },
      behavior: {
        personality: config?.personality || 'professional',
        verbosity: config?.verbosity || 'balanced',
        responseStyle: config?.response_style || 'conversational',
        includeExamples: config?.include_examples ?? true,
        includeExplanations: config?.include_explanations ?? true
      },
      features: {
        webSearch: config?.web_search_enabled ?? true,
        codeExecution: config?.code_execution_enabled ?? true,
        imageGeneration: config?.image_generation_enabled ?? false,
        voiceResponse: config?.voice_response_enabled ?? false,
        multimodal: config?.multimodal_enabled ?? true
      },
      limits: {
        dailyRequests: config?.daily_request_limit || 100,
        maxContextLength: config?.max_context_length || 8000,
        maxResponseLength: config?.max_response_length || 4000,
        rateLimitPerMinute: config?.rate_limit_per_minute || 20
      },
      integrations: {
        stripe: true,
        supabase: true,
        openai: config?.openai_enabled ?? true,
        vercel: true
      },
      usage: {
        totalRequests,
        successfulRequests,
        failedRequests,
        averageResponseTime: Math.round(avgResponseTime),
        lastUsed
      }
    };

    return NextResponse.json(javariConfig);

  } catch (error) {
    console.error('Admin Javari API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/javari
 * Update Javari AI configuration
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    
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

    // Prepare update object
    const updateData: any = {
      user_id: user.id,
      updated_at: new Date().toISOString()
    };

    switch (section) {
      case 'model': {
        const { name, temperature, maxTokens, topP } = data;
        
        if (name) updateData.model_name = name;
        if (temperature !== undefined) {
          if (temperature < 0 || temperature > 2) {
            return NextResponse.json(
              { error: 'Temperature must be between 0 and 2' },
              { status: 400 }
            );
          }
          updateData.temperature = temperature;
        }
        if (maxTokens) updateData.max_tokens = maxTokens;
        if (topP !== undefined) updateData.top_p = topP;
        break;
      }

      case 'behavior': {
        const { 
          personality, 
          verbosity, 
          responseStyle, 
          includeExamples, 
          includeExplanations 
        } = data;
        
        if (personality) updateData.personality = personality;
        if (verbosity) updateData.verbosity = verbosity;
        if (responseStyle) updateData.response_style = responseStyle;
        if (includeExamples !== undefined) updateData.include_examples = includeExamples;
        if (includeExplanations !== undefined) updateData.include_explanations = includeExplanations;
        break;
      }

      case 'features': {
        const { 
          webSearch, 
          codeExecution, 
          imageGeneration, 
          voiceResponse,
          multimodal 
        } = data;
        
        if (webSearch !== undefined) updateData.web_search_enabled = webSearch;
        if (codeExecution !== undefined) updateData.code_execution_enabled = codeExecution;
        if (imageGeneration !== undefined) updateData.image_generation_enabled = imageGeneration;
        if (voiceResponse !== undefined) updateData.voice_response_enabled = voiceResponse;
        if (multimodal !== undefined) updateData.multimodal_enabled = multimodal;
        break;
      }

      case 'limits': {
        const { 
          dailyRequests, 
          maxContextLength, 
          maxResponseLength, 
          rateLimitPerMinute 
        } = data;
        
        if (dailyRequests) updateData.daily_request_limit = dailyRequests;
        if (maxContextLength) updateData.max_context_length = maxContextLength;
        if (maxResponseLength) updateData.max_response_length = maxResponseLength;
        if (rateLimitPerMinute) updateData.rate_limit_per_minute = rateLimitPerMinute;
        break;
      }

      default:
        return NextResponse.json(
          { error: 'Invalid configuration section' },
          { status: 400 }
        );
    }

    // Upsert configuration
    const { error: upsertError } = await supabase
      .from('javari_config')
      .upsert(updateData, {
        onConflict: 'user_id'
      });

    if (upsertError) {
      console.error('Javari config update error:', upsertError);
      return NextResponse.json(
        { error: 'Failed to update Javari configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Javari AI configuration updated successfully'
    });

  } catch (error) {
    console.error('Admin Javari PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/javari
 * Perform Javari AI administrative actions
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'reset_config': {
        // Reset to default configuration
        const defaultConfig = {
          user_id: user.id,
          model_name: 'gpt-4-turbo',
          model_version: '2024-04-09',
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1.0,
          personality: 'professional',
          verbosity: 'balanced',
          response_style: 'conversational',
          include_examples: true,
          include_explanations: true,
          web_search_enabled: true,
          code_execution_enabled: true,
          image_generation_enabled: false,
          voice_response_enabled: false,
          multimodal_enabled: true,
          daily_request_limit: 100,
          max_context_length: 8000,
          max_response_length: 4000,
          rate_limit_per_minute: 20,
          openai_enabled: true,
          updated_at: new Date().toISOString()
        };

        const { error: resetError } = await supabase
          .from('javari_config')
          .upsert(defaultConfig, {
            onConflict: 'user_id'
          });

        if (resetError) {
          return NextResponse.json(
            { error: 'Failed to reset configuration' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Javari AI configuration reset to defaults'
        });
      }

      case 'clear_history': {
        // Clear conversation history
        const { error: clearError } = await supabase
          .from('javari_conversations')
          .delete()
          .eq('user_id', user.id);

        if (clearError) {
          return NextResponse.json(
            { error: 'Failed to clear history' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Conversation history cleared successfully'
        });
      }

      case 'test_connection': {
        // Test OpenAI API connection
        try {
          const testResponse = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
          });

          if (!testResponse.ok) {
            return NextResponse.json({
              success: false,
              message: 'OpenAI API connection failed',
              status: testResponse.status
            });
          }

          return NextResponse.json({
            success: true,
            message: 'OpenAI API connection successful'
          });

        } catch (error) {
          return NextResponse.json({
            success: false,
            message: 'Failed to connect to OpenAI API'
          });
        }
      }

      case 'regenerate_api_key': {
        // Generate new Javari-specific API key for external integrations
        const apiKey = `javari_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            javari_api_key: apiKey,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to regenerate API key' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          apiKey: apiKey,
          message: 'Javari API key regenerated successfully'
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Admin Javari POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
