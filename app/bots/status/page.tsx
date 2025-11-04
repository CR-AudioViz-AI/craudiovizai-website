'use client';

// ================================================================================
// CR AUDIOVIZ AI - PUBLIC BOT STATUS PAGE
// No authentication required - public monitoring dashboard
// ================================================================================

import { useEffect, useState } from 'react';

interface BotStatus {
  name: string;
  display_name: string;
  status: string;
  last_run_at: string | null;
  total_runs: number;
  successful_runs: number;
  avg_execution_time_ms: number | null;
}

export default function PublicBotStatusPage() {
  const [bots, setBots] = useState<BotStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBotStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadBotStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadBotStatus = async () => {
    try {
      const response = await fetch('/api/bots/status');
      
      if (!response.ok) {
        throw new Error('Failed to load bot status');
      }
      
      const data = await response.json();
      setBots(data.bots || []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'running': return 'bg-blue-500 animate-pulse';
      case 'paused': return 'bg-yellow-500';
      case 'disabled': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading bot system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🤖 Autonomous Bot System
          </h1>
          <p className="text-xl text-blue-200">
            Real-time monitoring of our 24/7 platform protection
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">System Online</span>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-200">⚠️ {error}</p>
            <p className="text-red-200 text-sm mt-2">
              System may be initializing. Please ensure database migration has been run.
            </p>
          </div>
        )}

        {/* Bot Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bots.length === 0 && !error ? (
            <div className="col-span-full text-center py-12 bg-white/5 backdrop-blur rounded-lg">
              <p className="text-white text-lg">No bots configured yet</p>
              <p className="text-blue-200 text-sm mt-2">Run database migration to initialize the system</p>
            </div>
          ) : (
            bots.map((bot) => {
              const successRate = bot.total_runs > 0 
                ? Math.round((bot.successful_runs / bot.total_runs) * 100) 
                : 0;

              return (
                <div
                  key={bot.name}
                  className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20 hover:border-white/40 transition-all hover:scale-105"
                >
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">
                      {bot.display_name}
                    </h3>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(bot.status)}`}></div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Total Runs:</span>
                      <span className="text-white font-medium">{bot.total_runs}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-blue-200">Success Rate:</span>
                      <span className={`font-medium ${successRate >= 80 ? 'text-green-400' : successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {successRate}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-blue-200">Avg Time:</span>
                      <span className="text-white font-medium">
                        {bot.avg_execution_time_ms ? `${Math.round(bot.avg_execution_time_ms)}ms` : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-blue-200">Last Run:</span>
                      <span className="text-white font-medium text-xs">
                        {bot.last_run_at 
                          ? new Date(bot.last_run_at).toLocaleTimeString() 
                          : 'Never'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${successRate >= 80 ? 'bg-green-500' : successRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${successRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* System Info */}
        <div className="mt-12 bg-white/5 backdrop-blur rounded-lg p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">System Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-3xl mb-2">🎭</div>
              <div className="text-white font-medium">Orchestration</div>
              <div className="text-blue-200">Master Conductor</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-white font-medium">Site Monitoring</div>
              <div className="text-blue-200">24/7 Protection</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔧</div>
              <div className="text-white font-medium">Auto-Healing</div>
              <div className="text-blue-200">Self-Repairing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-white font-medium">AI-Powered</div>
              <div className="text-blue-200">Learning System</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-blue-200 text-sm">
          <p>Powered by CR AudioViz AI | Your Story. Our Design.</p>
          <p className="mt-2">Status updates every 30 seconds</p>
        </div>
      </div>
    </div>
  );
}
