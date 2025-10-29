/**
 * CR AudioViz AI - JavariAI Memory System
 * Persistent memory across sessions for personalized AI experience
 * @timestamp October 28, 2025 - 12:18 PM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface UserMemory {
  user_id: string;
  preferences: {
    preferred_provider?: string;
    preferred_model?: string;
    temperature?: number;
    max_tokens?: number;
    tone?: string;
    response_length?: string;
    code_style?: string;
    language_preference?: string;
  };
  project_context: {
    current_projects?: string[];
    active_workflows?: string[];
    recent_tools_used?: string[];
    common_tasks?: string[];
    skills_level?: Record<string, string>;
  };
  learning_data: {
    successful_patterns?: string[];
    failed_attempts?: string[];
    feedback_history?: any[];
    improvement_areas?: string[];
    cost_preferences?: Record<string, any>;
  };
  interaction_history: {
    total_conversations?: number;
    favorite_topics?: string[];
    common_questions?: string[];
    time_patterns?: Record<string, any>;
    productivity_insights?: string[];
  };
  last_updated: string;
}

// GET - Fetch user memory
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user memory
    const { data: memory, error: memoryError } = await supabase
      .from('javari_user_memory')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (memoryError && memoryError.code !== 'PGRST116') {
      throw memoryError;
    }

    // If no memory exists, create default
    if (!memory) {
      const defaultMemory: UserMemory = {
        user_id: user.id,
        preferences: {
          preferred_provider: 'openai',
          preferred_model: 'gpt-4-turbo',
          temperature: 0.7,
          max_tokens: 2000,
          tone: 'professional',
          response_length: 'balanced',
          code_style: 'commented',
          language_preference: 'en'
        },
        project_context: {
          current_projects: [],
          active_workflows: [],
          recent_tools_used: [],
          common_tasks: [],
          skills_level: {}
        },
        learning_data: {
          successful_patterns: [],
          failed_attempts: [],
          feedback_history: [],
          improvement_areas: [],
          cost_preferences: { optimize_for: 'balance' }
        },
        interaction_history: {
          total_conversations: 0,
          favorite_topics: [],
          common_questions: [],
          time_patterns: {},
          productivity_insights: []
        },
        last_updated: new Date().toISOString()
      };

      const { data: newMemory, error: createError } = await supabase
        .from('javari_user_memory')
        .insert(defaultMemory)
        .select()
        .single();

      if (createError) throw createError;

      return NextResponse.json({
        success: true,
        memory: newMemory
      });
    }

    return NextResponse.json({
      success: true,
      memory: memory
    });

  } catch (error) {
    console.error('Memory fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memory' },
      { status: 500 }
    );
  }
}

// POST - Update user memory
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { updates, merge = true } = body;

    // Fetch current memory
    const { data: currentMemory } = await supabase
      .from('javari_user_memory')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let updatedMemory;

    if (merge && currentMemory) {
      // Deep merge updates with existing memory
      updatedMemory = {
        ...currentMemory,
        preferences: { ...currentMemory.preferences, ...updates.preferences },
        project_context: { ...currentMemory.project_context, ...updates.project_context },
        learning_data: { ...currentMemory.learning_data, ...updates.learning_data },
        interaction_history: { ...currentMemory.interaction_history, ...updates.interaction_history },
        last_updated: new Date().toISOString()
      };
    } else {
      updatedMemory = {
        user_id: user.id,
        ...updates,
        last_updated: new Date().toISOString()
      };
    }

    const { data: savedMemory, error: saveError } = await supabase
      .from('javari_user_memory')
      .upsert(updatedMemory)
      .select()
      .single();

    if (saveError) throw saveError;

    return NextResponse.json({
      success: true,
      memory: savedMemory
    });

  } catch (error) {
    console.error('Memory update error:', error);
    return NextResponse.json(
      { error: 'Failed to update memory' },
      { status: 500 }
    );
  }
}

// PATCH - Update specific memory section
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { section, data: sectionData } = body;

    if (!['preferences', 'project_context', 'learning_data', 'interaction_history'].includes(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    // Update specific section
    const { data: updatedMemory, error: updateError } = await supabase
      .from('javari_user_memory')
      .update({
        [section]: sectionData,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      memory: updatedMemory
    });

  } catch (error) {
    console.error('Memory section update error:', error);
    return NextResponse.json(
      { error: 'Failed to update memory section' },
      { status: 500 }
    );
  }
}

// Helper functions for memory management

export async function updateConversationStats(
  supabase: any,
  userId: string,
  conversationType: string,
  success: boolean
) {
  try {
    const { data: memory } = await supabase
      .from('javari_user_memory')
      .select('interaction_history, learning_data')
      .eq('user_id', userId)
      .single();

    if (!memory) return;

    const interactionHistory = memory.interaction_history || {};
    const learningData = memory.learning_data || {};

    // Update conversation count
    interactionHistory.total_conversations = (interactionHistory.total_conversations || 0) + 1;

    // Update favorite topics
    if (!interactionHistory.favorite_topics) interactionHistory.favorite_topics = [];
    if (!interactionHistory.favorite_topics.includes(conversationType)) {
      interactionHistory.favorite_topics.push(conversationType);
    }

    // Track success/failure patterns
    if (success) {
      if (!learningData.successful_patterns) learningData.successful_patterns = [];
      learningData.successful_patterns.push({
        type: conversationType,
        timestamp: new Date().toISOString()
      });
    } else {
      if (!learningData.failed_attempts) learningData.failed_attempts = [];
      learningData.failed_attempts.push({
        type: conversationType,
        timestamp: new Date().toISOString()
      });
    }

    // Update time patterns
    const hour = new Date().getHours();
    if (!interactionHistory.time_patterns) interactionHistory.time_patterns = {};
    interactionHistory.time_patterns[hour] = (interactionHistory.time_patterns[hour] || 0) + 1;

    await supabase
      .from('javari_user_memory')
      .update({
        interaction_history: interactionHistory,
        learning_data: learningData,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', userId);

  } catch (error) {
    console.error('Failed to update conversation stats:', error);
  }
}

export async function updateProjectContext(
  supabase: any,
  userId: string,
  project: string,
  tool: string
) {
  try {
    const { data: memory } = await supabase
      .from('javari_user_memory')
      .select('project_context')
      .eq('user_id', userId)
      .single();

    if (!memory) return;

    const projectContext = memory.project_context || {};

    // Update current projects
    if (!projectContext.current_projects) projectContext.current_projects = [];
    if (!projectContext.current_projects.includes(project)) {
      projectContext.current_projects.push(project);
      // Keep only last 10 projects
      if (projectContext.current_projects.length > 10) {
        projectContext.current_projects.shift();
      }
    }

    // Update recent tools used
    if (!projectContext.recent_tools_used) projectContext.recent_tools_used = [];
    if (!projectContext.recent_tools_used.includes(tool)) {
      projectContext.recent_tools_used.unshift(tool);
      // Keep only last 20 tools
      if (projectContext.recent_tools_used.length > 20) {
        projectContext.recent_tools_used.pop();
      }
    }

    await supabase
      .from('javari_user_memory')
      .update({
        project_context: projectContext,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', userId);

  } catch (error) {
    console.error('Failed to update project context:', error);
  }
}

export async function getPersonalizedRecommendations(
  supabase: any,
  userId: string
): Promise<string[]> {
  try {
    const { data: memory } = await supabase
      .from('javari_user_memory')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!memory) return [];

    const recommendations: string[] = [];

    // Analyze usage patterns
    const favoriteTopics = memory.interaction_history?.favorite_topics || [];
    const recentTools = memory.project_context?.recent_tools_used || [];
    const successfulPatterns = memory.learning_data?.successful_patterns || [];

    // Generate recommendations based on patterns
    if (favoriteTopics.includes('technical') && !recentTools.includes('code-generator')) {
      recommendations.push('Try the Code Generator tool - it might speed up your development workflow');
    }

    if (favoriteTopics.includes('creative') && !recentTools.includes('image-generator')) {
      recommendations.push('Explore the AI Image Generator for your creative projects');
    }

    // Cost optimization recommendations
    if (memory.learning_data?.cost_preferences?.optimize_for === 'cost') {
      recommendations.push('Consider using Claude Haiku or GPT-3.5-turbo for routine tasks to save 90%');
    }

    // Time pattern recommendations
    const timePatterns = memory.interaction_history?.time_patterns || {};
    const peakHour = Object.entries(timePatterns).sort(([, a], [, b]) => (b as number) - (a as number))[0];
    if (peakHour) {
      recommendations.push(`You're most productive around ${peakHour[0]}:00 - consider scheduling important tasks then`);
    }

    return recommendations;

  } catch (error) {
    console.error('Failed to generate recommendations:', error);
    return [];
  }
}
