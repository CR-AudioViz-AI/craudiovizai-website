// ================================================================================
// CR AUDIOVIZ AI - SCOUT BOT (REBUILT)
// Competitive intelligence with real database integration and NewsAPI
// ================================================================================

import { BaseBot } from './BaseBot';
import type { BotConfig, BotExecutionResult } from './types';
import { getErrorMessage, logError } from '@/lib/utils/error-utils';
import { createClient } from '@supabase/supabase-js';

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface Competitor {
  id: string;
  name: string;
  website: string;
  category: string;
  description: string;
}

interface NewsArticle {
  title: string;
  url: string;
  published_date: string;
  source: string;
  summary: string | null;
  category: string;
  competitor_id: string;
  competitor_name: string;
  importance_score: number;
  is_critical: boolean;
}

export class ScoutBot extends BaseBot {
  private supabase;

  constructor() {
    const config: BotConfig = {
      name: 'scout',
      displayName: 'Scout',
      description: 'Competitive intelligence bot that monitors competitors and aggregates industry news',
      schedule: '0 */6 * * *', // Every 6 hours
      capabilities: [
        'competitor_monitoring',
        'news_aggregation',
        'market_intelligence',
        'database_queries',
        'newsapi_integration'
      ]
    };
    super(config);
    
    // Initialize Supabase client with service role
    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  }

  async execute(): Promise<BotExecutionResult> {
    const findings: string[] = [];
    const actions: string[] = [];
    let severity: 'info' | 'warning' | 'critical' = 'info';

    try {
      findings.push('🔍 NEWS-SCOUT starting intelligence gathering...');
      
      // 1. Fetch competitors from database
      const competitors = await this.fetchCompetitorsFromDB();
      findings.push(`📊 Found ${competitors.length} competitors in database`);
      
      if (competitors.length === 0) {
        findings.push('⚠️  No competitors found - database may be empty');
        return {
          success: true,
          findings,
          actions: ['Seed competitors table with initial data'],
          severity: 'warning',
          metadata: {
            competitorsFound: 0,
            articlesFound: 0,
            articlesStored: 0
          }
        };
      }

      // 2. Scan NewsAPI for each competitor
      let totalArticles = 0;
      let storedArticles = 0;
      const criticalNews: string[] = [];

      for (const competitor of competitors) {
        findings.push(`\n🔎 Scanning news for: ${competitor.name}`);
        
        const articles = await this.scanNewsAPI(competitor);
        totalArticles += articles.length;
        
        if (articles.length > 0) {
          findings.push(`  ✓ Found ${articles.length} articles`);
          
          // Store articles in database
          const stored = await this.storeArticles(articles);
          storedArticles += stored;
          findings.push(`  ✓ Stored ${stored} new articles`);
          
          // Check for critical news
          const critical = articles.filter(a => a.is_critical);
          if (critical.length > 0) {
            severity = 'critical';
            criticalNews.push(`${competitor.name}: ${critical.length} critical items`);
          }
        } else {
          findings.push(`  ℹ️  No recent news found`);
        }
      }

      // 3. Summary
      findings.push('\n📈 INTELLIGENCE SUMMARY:');
      findings.push(`  • Competitors monitored: ${competitors.length}`);
      findings.push(`  • Articles found: ${totalArticles}`);
      findings.push(`  • New articles stored: ${storedArticles}`);
      
      if (criticalNews.length > 0) {
        findings.push('\n🚨 CRITICAL NEWS DETECTED:');
        findings.push(...criticalNews.map(n => `  • ${n}`));
        actions.push('Review critical competitor news immediately');
      }

      if (storedArticles > 0) {
        actions.push(`Process ${storedArticles} new articles for insights`);
      }

      return {
        success: true,
        findings,
        actions,
        severity,
        metadata: {
          competitorsMonitored: competitors.length,
          articlesFound: totalArticles,
          articlesStored: storedArticles,
          criticalNews: criticalNews.length
        }
      };

    } catch (error: unknown) {
      logError('ScoutBot execution error:', error);
      return this.handleError(error as Error);
    }
  }

  /**
   * Fetch active competitors from database
   */
  private async fetchCompetitorsFromDB(): Promise<Competitor[]> {
    try {
      const { data, error } = await this.supabase
        .from('competitors')
        .select('id, name, website, category, description')
        .eq('is_active', true)
        .order('name');

      if (error) {
        logError('Error fetching competitors:', error);
        return [];
      }

      return data || [];
    } catch (error: unknown) {
      logError('Exception fetching competitors:', error);
      return [];
    }
  }

  /**
   * Scan NewsAPI for competitor mentions
   */
  private async scanNewsAPI(competitor: Competitor): Promise<NewsArticle[]> {
    if (!NEWSAPI_KEY) {
      console.log('⚠️  NewsAPI key not configured');
      return [];
    }

    try {
      // Build search query - use company name and category keywords
      const searchTerms = [
        competitor.name,
        // Add category-specific terms
        ...(competitor.category === 'AI Content' ? ['AI', 'artificial intelligence'] : []),
        ...(competitor.category === 'Design Tools' ? ['design', 'creative'] : []),
        ...(competitor.category === 'Video Editing' ? ['video', 'editing'] : [])
      ];

      const query = searchTerms.slice(0, 3).join(' OR '); // Limit to 3 terms for better results

      const response = await fetch(
        `https://newsapi.org/v2/everything?` +
        `q=${encodeURIComponent(query)}&` +
        `sortBy=publishedAt&` +
        `pageSize=10&` +
        `language=en&` +
        `apiKey=${NEWSAPI_KEY}`,
        { signal: AbortSignal.timeout(10000) }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`NewsAPI error for ${competitor.name}: ${response.status} - ${errorText}`);
        return [];
      }

      const data = await response.json();

      if (data.status !== 'ok' || !data.articles) {
        console.error(`NewsAPI returned invalid data for ${competitor.name}`);
        return [];
      }

      // Transform NewsAPI articles to our format
      const articles: NewsArticle[] = data.articles
        .filter((article: any) => article.title && article.url && article.publishedAt)
        .map((article: any) => {
          // Calculate importance based on title keywords
          const titleLower = article.title.toLowerCase();
          let importanceScore = 5; // Default
          let isCritical = false;

          // Boost importance for key terms
          if (titleLower.includes('funding') || titleLower.includes('acquisition')) {
            importanceScore = 9;
            isCritical = true;
          } else if (titleLower.includes('launch') || titleLower.includes('release')) {
            importanceScore = 8;
          } else if (titleLower.includes('partnership') || titleLower.includes('integration')) {
            importanceScore = 7;
          }

          return {
            title: article.title,
            url: article.url,
            published_date: article.publishedAt,
            source: article.source?.name || 'NewsAPI',
            summary: article.description || article.content?.substring(0, 500) || null,
            category: 'competitor_news',
            competitor_id: competitor.id,
            competitor_name: competitor.name,
            importance_score: importanceScore,
            is_critical: isCritical
          };
        });

      return articles;

    } catch (error: unknown) {
      logError(`NewsAPI scan error for ${competitor.name}:`, error);
      return [];
    }
  }

  /**
   * Store articles in database (avoiding duplicates)
   */
  private async storeArticles(articles: NewsArticle[]): Promise<number> {
    if (articles.length === 0) return 0;

    try {
      let storedCount = 0;

      for (const article of articles) {
        // Check if article already exists
        const { data: existing } = await this.supabase
          .from('news_articles')
          .select('id')
          .eq('url', article.url)
          .single();

        if (existing) {
          // Article already exists, skip
          continue;
        }

        // Insert new article
        const { error } = await this.supabase
          .from('news_articles')
          .insert([article]);

        if (error) {
          logError(`Error storing article: ${article.title}`, error);
          continue;
        }

        storedCount++;
      }

      return storedCount;

    } catch (error: unknown) {
      logError('Exception storing articles:', error);
      return 0;
    }
  }
}
