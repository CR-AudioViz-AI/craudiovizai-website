/**
 * CR AudioViz AI - JavariAI Analytics API
 * Provides comprehensive usage analytics across all AI providers
 * @timestamp October 28, 2025 - 11:55 AM EST
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user analytics from view
    const { data: analytics, error: analyticsError } = await supabase
      .from('javari_user_analytics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (analyticsError && analyticsError.code !== 'PGRST116') {
      console.error('Analytics error:', analyticsError);
    }

    // Fetch provider performance metrics
    const { data: providerPerformance, error: perfError } = await supabase
      .from('javari_provider_performance')
      .select('*')
      .order('total_requests', { ascending: false });

    if (perfError) {
      console.error('Provider performance error:', perfError);
    }

    // Fetch recent learning patterns
    const { data: learningPatterns, error: learningError } = await supabase
      .from('javari_learning_patterns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (learningError) {
      console.error('Learning patterns error:', learningError);
    }

    // Calculate advanced metrics
    const patterns = learningPatterns || [];
    const patternsByType = patterns.reduce((acc, p) => {
      acc[p.conversation_type] = (acc[p.conversation_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgQualityByProvider = patterns.reduce((acc, p) => {
      if (!acc[p.provider]) {
        acc[p.provider] = { total: 0, count: 0 };
      }
      acc[p.provider].total += p.response_quality;
      acc[p.provider].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const providerQualityScores = Object.entries(avgQualityByProvider).reduce((acc, [provider, data]) => {
      acc[provider] = Math.round((data.total / data.count) * 100) / 100;
      return acc;
    }, {} as Record<string, number>);

    const costEfficiency = patterns.reduce((acc, p) => {
      if (!acc[p.provider]) {
        acc[p.provider] = { total_cost: 0, total_tokens: 0 };
      }
      const cost = p.cost_efficiency * p.tokens_used;
      acc[p.provider].total_cost += cost;
      acc[p.provider].total_tokens += p.tokens_used;
      return acc;
    }, {} as Record<string, { total_cost: number; total_tokens: number }>);

    const costPerProvider = Object.entries(costEfficiency).reduce((acc, [provider, data]) => {
      acc[provider] = {
        total_cost: Math.round(data.total_cost * 10000) / 10000,
        cost_per_1k_tokens: Math.round((data.total_cost / data.total_tokens) * 1000 * 10000) / 10000
      };
      return acc;
    }, {} as Record<string, { total_cost: number; cost_per_1k_tokens: number }>);

    return NextResponse.json({
      success: true,
      analytics: analytics || {
        total_conversations: 0,
        total_tokens_used: 0,
        total_cost: 0,
        avg_tokens_per_conversation: 0,
        avg_cost_per_conversation: 0,
        providers_used: 0,
        requests_by_provider: {}
      },
      provider_performance: providerPerformance || [],
      learning_insights: {
        conversation_patterns: patternsByType,
        provider_quality_scores: providerQualityScores,
        cost_analysis: costPerProvider,
        total_patterns: patterns.length
      },
      recommendations: generateRecommendations(analytics, providerPerformance, patterns),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('JavariAI analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(
  analytics: any,
  providerPerformance: any[],
  learningPatterns: any[]
): string[] {
  const recommendations: string[] = [];

  if (!analytics || !providerPerformance || !learningPatterns) {
    return ['Start using JavariAI to receive personalized recommendations'];
  }

  // Cost optimization recommendations
  const avgCost = analytics.avg_cost_per_conversation || 0;
  if (avgCost > 0.05) {
    recommendations.push(
      'Consider using GPT-3.5-turbo or Claude Haiku for routine tasks to reduce costs by up to 90%'
    );
  }

  // Provider reliability recommendations
  const reliableProviders = providerPerformance
    .filter(p => p.uptime_percentage > 95 && p.total_requests > 10)
    .sort((a, b) => b.uptime_percentage - a.uptime_percentage);

  if (reliableProviders.length > 0) {
    recommendations.push(
      `${reliableProviders[0].provider} has ${reliableProviders[0].uptime_percentage.toFixed(1)}% uptime - most reliable for critical tasks`
    );
  }

  // Usage pattern recommendations
  const conversationTypes = learningPatterns.reduce((acc, p) => {
    acc[p.conversation_type] = (acc[p.conversation_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonType = Object.entries(conversationTypes)
    .sort(([, a], [, b]) => b - a)[0];

  if (mostCommonType) {
    const [type, count] = mostCommonType;
    const typeRecommendations: Record<string, string> = {
      technical: 'For code-heavy tasks, GPT-4 and Claude 3.5 Sonnet excel at debugging and algorithm design',
      creative: 'Claude 3 Opus offers superior creative writing and storytelling capabilities',
      analytical: 'GPT-4 Turbo provides excellent data analysis at a lower cost point',
      support: 'Claude 3 Haiku offers fast, affordable responses for support conversations'
    };
    
    if (typeRecommendations[type]) {
      recommendations.push(typeRecommendations[type]);
    }
  }

  // Token usage recommendations
  const avgTokens = analytics.avg_tokens_per_conversation || 0;
  if (avgTokens > 2000) {
    recommendations.push(
      'Your conversations average high token usage. Consider breaking complex queries into smaller chunks to reduce costs'
    );
  }

  // Quality recommendations
  const lowQualityPatterns = learningPatterns.filter(p => p.response_quality < 3);
  if (lowQualityPatterns.length > learningPatterns.length * 0.2) {
    recommendations.push(
      'Response quality could be improved. Try adjusting temperature settings or switching to more capable models'
    );
  }

  return recommendations.length > 0 
    ? recommendations 
    : ['Your AI usage is optimized! Keep up the great work.'];
}
