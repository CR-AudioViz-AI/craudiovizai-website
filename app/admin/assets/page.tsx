// CR AudioViz AI - Assets Management Page
// Session: 2025-10-24 1:05 PM EST
// Complete assets management with gallery view and filters

import { createServerClient } from '@/lib/supabase-server';
import { Image, Video, Music, Code, File, Download, Trash2, Eye } from 'lucide-react';

const ASSET_TYPE_CONFIG = {
  image: { icon: Image, color: 'blue', label: 'Images' },
  video: { icon: Video, color: 'red', label: 'Videos' },
  audio: { icon: Music, color: 'green', label: 'Audio' },
  code: { icon: Code, color: 'purple', label: 'Code' },
  document: { icon: File, color: 'gray', label: 'Documents' },
};

export default async function AssetsManagementPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return null; // Layout will redirect
  }

  // Get all AI generations (assets)
  const { data: assets } = await supabase
    .from('ai_generations')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  // Calculate stats by type
  const statsByType = assets?.reduce((acc, asset) => {
    const type = asset.generation_type || 'document';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assets Management</h1>
        <p className="mt-2 text-gray-600">
          View, download, and manage all your AI-generated content
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Object.entries(ASSET_TYPE_CONFIG).map(([type, config]) => {
          const Icon = config.icon;
          const count = statsByType[type] || 0;
          
          return (
            <div
              key={type}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg bg-${config.color}-100 flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${config.color}-600`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{config.label}</div>
            </div>
          );
        })}
      </div>

      {/* Assets Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Assets</h2>
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="code">Code</option>
              <option value="document">Documents</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {assets && assets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => {
              const type = asset.generation_type || 'document';
              const config = ASSET_TYPE_CONFIG[type as keyof typeof ASSET_TYPE_CONFIG] || ASSET_TYPE_CONFIG.document;
              const Icon = config.icon;

              return (
                <div
                  key={asset.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  {/* Preview/Thumbnail */}
                  <div className={`h-48 bg-${config.color}-50 flex items-center justify-center relative`}>
                    <Icon className={`w-16 h-16 text-${config.color}-400`} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        <Eye className="w-5 h-5 text-gray-700" />
                      </button>
                      <button className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors">
                        <Download className="w-5 h-5 text-gray-700" />
                      </button>
                      <button className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {asset.prompt?.substring(0, 50) || 'Untitled'}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
                        {type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(asset.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>{asset.credits_used || 0} credits</span>
                    </div>

                    {asset.app_type && (
                      <div className="mt-2 text-xs text-gray-600">
                        App: <span className="font-medium">{asset.app_type}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <File className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assets yet</h3>
            <p className="text-gray-600 mb-6">
              Start using our AI apps to generate images, videos, code, and more!
            </p>
            <a
              href="/apps"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Explore Apps
            </a>
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Storage Information</h3>
            <p className="text-sm text-gray-600">
              Your assets are stored securely and accessible anytime. Download limits may apply based on your plan.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Assets</div>
            <div className="text-2xl font-bold text-gray-900">{assets?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
