'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  GitBranch,
  RefreshCw,
  Eye,
  AlertCircle,
  TrendingUp,
  Zap,
  ExternalLink,
  Terminal
} from 'lucide-react';

interface Deployment {
  id: string;
  name: string;
  url: string;
  created: number;
  state: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED' | 'CANCELED';
  creator: {
    username: string;
    email: string;
  };
  meta: {
    githubCommitMessage?: string;
    githubCommitRef?: string;
    githubCommitSha?: string;
  };
  inspectorUrl: string;
}

interface ProjectStats {
  totalDeployments: number;
  successRate: number;
  avgBuildTime: number;
  lastDeployment: string;
}

export default function VercelMonitoringPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadDeployments();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadDeployments(true);
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadDeployments = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // Mock data for now - replace with actual Vercel API call
      const mockDeployments: Deployment[] = [
        {
          id: 'dpl_001',
          name: 'craudiovizai-website',
          url: 'craudiovizai-website-main.vercel.app',
          created: Date.now() - 3600000,
          state: 'READY',
          creator: {
            username: 'royhenderson-9513',
            email: 'royhenderson@craudiovizai.com'
          },
          meta: {
            githubCommitMessage: 'Add new dashboard features',
            githubCommitRef: 'main',
            githubCommitSha: 'abc123'
          },
          inspectorUrl: 'https://vercel.com/deployment/dpl_001'
        },
        {
          id: 'dpl_002',
          name: 'craudiovizai-website',
          url: 'craudiovizai-website-preview.vercel.app',
          created: Date.now() - 7200000,
          state: 'READY',
          creator: {
            username: 'royhenderson-9513',
            email: 'royhenderson@craudiovizai.com'
          },
          meta: {
            githubCommitMessage: 'Update API routes',
            githubCommitRef: 'feature/api-updates',
            githubCommitSha: 'def456'
          },
          inspectorUrl: 'https://vercel.com/deployment/dpl_002'
        },
        {
          id: 'dpl_003',
          name: 'craudiovizai-website',
          url: 'craudiovizai-website-error.vercel.app',
          created: Date.now() - 10800000,
          state: 'ERROR',
          creator: {
            username: 'royhenderson-9513',
            email: 'royhenderson@craudiovizai.com'
          },
          meta: {
            githubCommitMessage: 'Fix build issues',
            githubCommitRef: 'feature/fixes',
            githubCommitSha: 'ghi789'
          },
          inspectorUrl: 'https://vercel.com/deployment/dpl_003'
        }
      ];

      setDeployments(mockDeployments);

      // Calculate stats
      const successCount = mockDeployments.filter(d => d.state === 'READY').length;
      const successRate = (successCount / mockDeployments.length) * 100;

      setStats({
        totalDeployments: 247,
        successRate: successRate,
        avgBuildTime: 47,
        lastDeployment: new Date(mockDeployments[0].created).toLocaleString()
      });
    } catch (error) {
      console.error('Error loading deployments:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDeployments();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'READY':
        return 'bg-green-500';
      case 'ERROR':
        return 'bg-red-500';
      case 'BUILDING':
        return 'bg-blue-500';
      case 'QUEUED':
        return 'bg-yellow-500';
      case 'CANCELED':
        return 'bg-slate-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'READY':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'ERROR':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'BUILDING':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'QUEUED':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'CANCELED':
        return <AlertCircle className="w-5 h-5 text-slate-500" />;
      default:
        return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-slate-400 text-lg">Loading Vercel deployments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Zap className="w-10 h-10 text-blue-500" />
              Vercel Monitoring
            </h1>
            <p className="text-slate-400 text-lg">
              Real-time deployment tracking and build monitoring
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                autoRefresh
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              <Activity className="w-5 h-5" />
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 ${
                refreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm font-medium">Total Deployments</h3>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalDeployments}</p>
              <p className="text-slate-500 text-sm mt-1">all time</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm font-medium">Success Rate</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.successRate.toFixed(1)}%</p>
              <p className="text-slate-500 text-sm mt-1">build quality</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm font-medium">Avg Build Time</h3>
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.avgBuildTime}s</p>
              <p className="text-slate-500 text-sm mt-1">typical speed</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 text-sm font-medium">Last Deployment</h3>
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-lg font-bold text-white">
                {formatTimeAgo(deployments[0]?.created || Date.now())}
              </p>
              <p className="text-slate-500 text-sm mt-1">most recent</p>
            </div>
          </div>
        )}

        {/* Deployments List */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-blue-500" />
              Recent Deployments
            </h2>
          </div>

          <div className="divide-y divide-slate-700">
            {deployments.map((deployment) => (
              <div
                key={deployment.id}
                className="p-6 hover:bg-slate-800/50 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedDeployment(deployment);
                  setShowLogsModal(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {getStateIcon(deployment.state)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold text-lg">
                          {deployment.meta.githubCommitMessage || 'No commit message'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(deployment.state)} text-white`}>
                          {deployment.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-4 h-4" />
                          {deployment.meta.githubCommitRef || 'unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(deployment.created)}
                        </span>
                        <span className="font-mono text-xs">
                          {deployment.meta.githubCommitSha?.substring(0, 7) || 'no-sha'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={deployment.inspectorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Inspector
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDeployment(deployment);
                        setShowLogsModal(true);
                      }}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Terminal className="w-4 h-4" />
                      Logs
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      {showLogsModal && selectedDeployment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Build Logs</h2>
                <p className="text-slate-400 text-sm">{selectedDeployment.meta.githubCommitMessage}</p>
              </div>
              <button
                onClick={() => {
                  setShowLogsModal(false);
                  setSelectedDeployment(null);
                }}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto">
                <div className="space-y-1">
                  <div className="text-green-400">[00:00:00] Starting build process...</div>
                  <div className="text-blue-400">[00:00:02] Installing dependencies...</div>
                  <div className="text-slate-400">[00:00:15] Dependencies installed successfully</div>
                  <div className="text-blue-400">[00:00:16] Running build command...</div>
                  <div className="text-slate-400">[00:00:45] Build completed successfully</div>
                  <div className="text-green-400">[00:00:47] Deployment ready ✓</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowLogsModal(false);
                  setSelectedDeployment(null);
                }}
                className="w-full mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
