// app/admin/javari/page.tsx
// Javari AI Admin Dashboard - See everything she knows
// Timestamp: 2025-11-30 05:10 AM EST

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Brain, 
  Bot, 
  Database, 
  AlertTriangle, 
  BookOpen, 
  Zap,
  RefreshCw,
  Plus,
  Search,
  TrendingUp,
  Globe,
  Code,
  Shield,
  Activity
} from 'lucide-react';

interface KnowledgeOverview {
  total_knowledge: number;
  verified_knowledge: number;
  unique_topics: number;
  active_sources: number;
  total_insights: number;
  error_patterns_count: number;
  cached_solutions: number;
}

interface AppHealth {
  app_name: string;
  display_name: string;
  status: string;
  health_status: string;
  production_url: string | null;
  open_errors: number;
}

interface BotStatus {
  bot_name: string;
  bot_type: string;
  is_active: boolean;
  is_running: boolean;
  last_run_at: string | null;
  total_runs: number;
  successful_runs: number;
  success_rate: number;
}

interface KnowledgeSource {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string;
  category: string;
  subcategory: string | null;
  is_active: boolean;
  last_crawled_at: string | null;
  pages_indexed: number;
  priority: number;
}

export default function JavariAdminDashboard() {
  const [overview, setOverview] = useState<KnowledgeOverview | null>(null);
  const [apps, setApps] = useState<AppHealth[]>([]);
  const [bots, setBots] = useState<BotStatus[]>([]);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge' | 'sources' | 'bots' | 'errors' | 'feed'>('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      // Load overview stats
      const { data: overviewData } = await supabase
        .from('admin_knowledge_overview')
        .select('*')
        .single();
      if (overviewData) setOverview(overviewData);

      // Load app health
      const { data: appsData } = await supabase
        .from('admin_app_health')
        .select('*');
      if (appsData) setApps(appsData);

      // Load bot status
      const { data: botsData } = await supabase
        .from('admin_bot_status')
        .select('*');
      if (botsData) setBots(botsData);

      // Load knowledge sources
      const { data: sourcesData } = await supabase
        .from('knowledge_sources')
        .select('*')
        .order('priority', { ascending: false });
      if (sourcesData) setSources(sourcesData);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
    setLoading(false);
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue',
    subtitle 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    color?: string;
    subtitle?: string;
  }) => (
    <div className={`bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-${color}-500/50 transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value.toLocaleString()}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-500/20 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': case 'healthy': case 'success': return 'text-green-400 bg-green-400/20';
      case 'development': case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'down': case 'failed': case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getBotTypeIcon = (type: string) => {
    switch (type) {
      case 'monitor': return Activity;
      case 'crawler': return Globe;
      case 'fixer': return Code;
      case 'reporter': return TrendingUp;
      default: return Bot;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-purple-500 animate-pulse mx-auto" />
          <p className="text-gray-400 mt-4">Loading Javari's Brain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Javari AI Dashboard</h1>
                <p className="text-gray-400 text-sm">Monitor, manage, and feed her knowledge</p>
              </div>
            </div>
            <button
              onClick={loadDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
              { id: 'sources', label: 'Sources (73)', icon: Globe },
              { id: 'bots', label: 'Bots (9)', icon: Bot },
              { id: 'errors', label: 'Errors', icon: AlertTriangle },
              { id: 'feed', label: 'Feed Knowledge', icon: Plus },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Knowledge" 
                value={overview.total_knowledge} 
                icon={Brain} 
                color="purple"
                subtitle={`${overview.verified_knowledge} verified`}
              />
              <StatCard 
                title="Knowledge Sources" 
                value={overview.active_sources} 
                icon={Globe} 
                color="blue"
                subtitle="Active crawling"
              />
              <StatCard 
                title="Conversation Insights" 
                value={overview.total_insights} 
                icon={Zap} 
                color="yellow"
                subtitle="Learned from chats"
              />
              <StatCard 
                title="Error Patterns" 
                value={overview.error_patterns_count} 
                icon={Shield} 
                color="green"
                subtitle={`${overview.cached_solutions} solutions cached`}
              />
            </div>

            {/* Apps Health */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                App Health Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apps.map(app => (
                  <div 
                    key={app.app_name}
                    className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{app.display_name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{app.app_name}</span>
                      {app.open_errors > 0 && (
                        <span className="text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {app.open_errors} errors
                        </span>
                      )}
                    </div>
                    {app.production_url && (
                      <a 
                        href={app.production_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline mt-2 block truncate"
                      >
                        {app.production_url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bots Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-400" />
                Autonomous Bots
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bots.map(bot => {
                  const BotIcon = getBotTypeIcon(bot.bot_type);
                  return (
                    <div 
                      key={bot.bot_name}
                      className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${bot.is_active ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                          <BotIcon className={`w-4 h-4 ${bot.is_active ? 'text-green-400' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <h3 className="font-medium">{bot.bot_name}</h3>
                          <p className="text-xs text-gray-500">{bot.bot_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-3">
                        <span className="text-gray-400">
                          {bot.total_runs} runs
                        </span>
                        <span className={bot.success_rate >= 90 ? 'text-green-400' : 'text-yellow-400'}>
                          {bot.success_rate}% success
                        </span>
                      </div>
                      {bot.is_running && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-blue-400">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          Running now...
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Sources Tab */}
        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Knowledge Sources ({sources.length})</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search sources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Source
                </button>
              </div>
            </div>

            {/* Sources by Category */}
            {['development', 'ai_tools', 'real_estate', 'legal', 'finance', 'marketing', 'travel'].map(category => {
              const categorySources = sources.filter(s => 
                s.category === category && 
                (searchQuery === '' || s.source_name.toLowerCase().includes(searchQuery.toLowerCase()))
              );
              if (categorySources.length === 0) return null;
              
              return (
                <div key={category} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    {category.replace('_', ' ')} ({categorySources.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySources.map(source => (
                      <div 
                        key={source.id}
                        className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{source.source_name}</h4>
                          <span className={`w-2 h-2 rounded-full ${source.is_active ? 'bg-green-400' : 'bg-gray-600'}`} />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{source.source_type}</span>
                          <span>P{source.priority}</span>
                        </div>
                        {source.last_crawled_at && (
                          <p className="text-xs text-gray-600 mt-1">
                            Last crawled: {new Date(source.last_crawled_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bots Tab */}
        {activeTab === 'bots' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Autonomous Bots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bots.map(bot => {
                const BotIcon = getBotTypeIcon(bot.bot_type);
                return (
                  <div 
                    key={bot.bot_name}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${bot.is_active ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                          <BotIcon className={`w-6 h-6 ${bot.is_active ? 'text-green-400' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{bot.bot_name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{bot.bot_type}</p>
                        </div>
                      </div>
                      <button 
                        className={`px-3 py-1 rounded text-sm ${
                          bot.is_active 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {bot.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold">{bot.total_runs}</p>
                        <p className="text-xs text-gray-500">Total Runs</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-green-400">{bot.successful_runs}</p>
                        <p className="text-xs text-gray-500">Successful</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <p className={`text-2xl font-bold ${bot.success_rate >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {bot.success_rate}%
                        </p>
                        <p className="text-xs text-gray-500">Success Rate</p>
                      </div>
                    </div>

                    {bot.last_run_at && (
                      <p className="text-sm text-gray-500">
                        Last run: {new Date(bot.last_run_at).toLocaleString()}
                      </p>
                    )}

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg text-sm">
                        Run Now
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg text-sm">
                        View Logs
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Feed Knowledge Tab */}
        {activeTab === 'feed' && (
          <FeedKnowledgePanel />
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <KnowledgeBasePanel />
        )}

        {/* Errors Tab */}
        {activeTab === 'errors' && (
          <ErrorsPanel />
        )}

      </div>
    </div>
  );
}

// Feed Knowledge Panel Component
function FeedKnowledgePanel() {
  const [feedType, setFeedType] = useState<'url' | 'text' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('development');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleFeed() {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/javari/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedType,
          url,
          text,
          topic,
          category
        })
      });
      
      const data = await response.json();
      setResult(data.success ? `✅ Added ${data.entriesCreated} knowledge entries` : `❌ ${data.error}`);
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Plus className="w-5 h-5 text-purple-400" />
        Feed Javari New Knowledge
      </h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {/* Feed Type Selector */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'url', label: 'From URL' },
            { id: 'text', label: 'Direct Text' },
            { id: 'file', label: 'Upload File' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setFeedType(type.id as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                feedType === type.id 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Topic & Category */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Stripe Webhooks"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="development">Development</option>
              <option value="ai_tools">AI Tools</option>
              <option value="real_estate">Real Estate</option>
              <option value="legal">Legal</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
              <option value="travel">Travel</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Input based on type */}
        {feedType === 'url' && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">URL to Scrape</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.stripe.com/webhooks"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {feedType === 'text' && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Knowledge Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste documentation, guides, or any knowledge here..."
              rows={10}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 font-mono text-sm"
            />
          </div>
        )}

        {feedType === 'file' && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Upload File</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
              <Database className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">Drag & drop or click to upload</p>
              <p className="text-gray-600 text-sm mt-1">Supports: .md, .txt, .json, .pdf</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleFeed}
          disabled={loading}
          className="w-full py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Feed to Javari
            </>
          )}
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded-lg ${result.startsWith('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {result}
          </div>
        )}
      </div>
    </div>
  );
}

// Knowledge Base Panel
function KnowledgeBasePanel() {
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadKnowledge();
  }, []);

  async function loadKnowledge() {
    setLoading(true);
    const { data } = await supabase
      .from('javari_knowledge')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) setKnowledge(data);
    setLoading(false);
  }

  const filteredKnowledge = knowledge.filter(k =>
    searchQuery === '' ||
    k.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.concept?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Knowledge Base ({knowledge.length} entries)</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredKnowledge.map(entry => (
          <div 
            key={entry.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                  {entry.topic}
                </span>
                {entry.subtopic && (
                  <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                    {entry.subtopic}
                  </span>
                )}
                {entry.verified && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                    ✓ Verified
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </div>
            <h3 className="font-medium mb-1">{entry.concept}</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{entry.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Errors Panel
function ErrorsPanel() {
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadErrors();
  }, []);

  async function loadErrors() {
    setLoading(true);
    const { data } = await supabase
      .from('error_tracking')
      .select('*, app_registry(display_name)')
      .eq('is_resolved', false)
      .order('last_seen_at', { ascending: false })
      .limit(50);
    if (data) setErrors(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        Unresolved Errors ({errors.length})
      </h2>

      {errors.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-400">All Clear!</h3>
          <p className="text-gray-400 mt-2">No unresolved errors at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {errors.map(error => (
            <div 
              key={error.id}
              className="bg-gray-900 border border-red-900/50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                  {error.error_type}
                </span>
                <span className="text-xs text-gray-500">
                  {error.occurrence_count}x • Last: {new Date(error.last_seen_at).toLocaleString()}
                </span>
              </div>
              <p className="font-mono text-sm text-red-300 mb-2">{error.error_message}</p>
              {error.app_registry && (
                <p className="text-xs text-gray-500">App: {error.app_registry.display_name}</p>
              )}
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded text-sm">
                  Mark Resolved
                </button>
                <button className="px-3 py-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded text-sm">
                  Auto-Fix
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
