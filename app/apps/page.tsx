'use client';

// ================================================================================
// CR AUDIOVIZ AI - APPS DASHBOARD PAGE
// Browse and launch 60+ professional applications
// ================================================================================

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Grid3x3, List, Sparkles, Zap } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface App {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon_url?: string;
  credits_cost: number;
  is_free: boolean;
  is_beta: boolean;
  is_premium: boolean;
  rating: number;
  usage_count: number;
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [credits, setCredits] = useState(0);

  const categories = [
    'All',
    'Document Creation',
    'Design & Creative',
    'AI Content',
    'Business Tools',
    'Legal & Compliance',
    'Marketing',
    'Data & Analytics',
    'Communication'
  ];

  // Fetch apps and user credits
  useEffect(() => {
    fetchApps();
    fetchCredits();
  }, []);

  // Filter apps when search or category changes
  useEffect(() => {
    filterApps();
  }, [searchTerm, selectedCategory, apps]);

  async function fetchApps() {
    try {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      
      setApps(data || []);
      setFilteredApps(data || []);
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCredits() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/credits/balance', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await response.json();
      if (data.credits) {
        setCredits(data.credits.balance);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  }

  function filterApps() {
    let filtered = apps;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApps(filtered);
  }

  async function launchApp(app: App) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to launch apps');
        return;
      }

      // Check credits if not free
      if (!app.is_free && app.credits_cost > credits) {
        alert(`Insufficient credits. You need ${app.credits_cost} credits but have ${credits}.`);
        return;
      }

      const response = await fetch('/api/apps/launch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ app_slug: app.slug })
      });

      const data = await response.json();

      if (data.success) {
        // Update credits display
        if (data.credits_deducted > 0) {
          setCredits(prev => prev - data.credits_deducted);
        }

        // Launch app based on type
        if (app.app_url) {
          if (data.app.app_type === 'new_tab') {
            window.open(app.app_url, '_blank');
          } else if (data.app.app_type === 'external') {
            window.location.href = app.app_url;
          } else {
            // embedded or modal - show in modal
            setSelectedApp(app);
          }
        }
      } else {
        alert(data.error || 'Failed to launch app');
      }
    } catch (error) {
      console.error('Error launching app:', error);
      alert('Failed to launch app. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading apps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Apps</h1>
              <p className="text-gray-600 mt-1">
                {filteredApps.length} professional applications at your fingertips
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg">
                <Zap className="inline w-4 h-4 mr-2" />
                {credits} Credits
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apps Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No apps found matching your criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} onLaunch={launchApp} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <AppListItem key={app.id} app={app} onLaunch={launchApp} />
            ))}
          </div>
        )}
      </div>

      {/* App Modal */}
      {selectedApp && (
        <AppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
}

// App Card Component
function AppCard({ app, onLaunch }: { app: App; onLaunch: (app: App) => void }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
          {app.name.charAt(0)}
        </div>
        {app.is_beta && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
            BETA
          </span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 mb-2">{app.name}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{app.category}</span>
        <div className="flex items-center gap-2">
          {app.is_free ? (
            <span className="text-green-600 font-semibold text-sm">FREE</span>
          ) : (
            <span className="text-blue-600 font-semibold text-sm">
              {app.credits_cost} <Zap className="inline w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onLaunch(app)}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
      >
        Launch App
      </button>
    </div>
  );
}

// App List Item Component
function AppListItem({ app, onLaunch }: { app: App; onLaunch: (app: App) => void }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {app.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{app.name}</h3>
              {app.is_beta && (
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  BETA
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{app.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{app.category}</span>
              <span>•</span>
              <span>{app.usage_count.toLocaleString()} launches</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            {app.is_free ? (
              <span className="text-green-600 font-semibold">FREE</span>
            ) : (
              <span className="text-blue-600 font-semibold">
                {app.credits_cost} <Zap className="inline w-4 h-4" />
              </span>
            )}
          </div>
          <button
            onClick={() => onLaunch(app)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Launch
          </button>
        </div>
      </div>
    </div>
  );
}

// App Modal Component
function AppModal({ app, onClose }: { app: App; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{app.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={app.app_url}
            className="w-full h-full border-0"
            title={app.name}
          />
        </div>
      </div>
    </div>
  );
}
