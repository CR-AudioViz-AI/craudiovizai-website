'use client';

// ================================================================================
// CR AUDIOVIZ AI - AUTONOMOUS BOT SYSTEM
// Admin Dashboard - Bot Monitoring Page
// ================================================================================

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Bot {
  id: string;
  name: string;
  display_name: string;
  status: string;
  last_run_at: string | null;
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  avg_execution_time_ms: number | null;
}

interface BotExecution {
  id: string;
  bot_id: string;
  status: string;
  started_at: string;
  execution_time_ms: number | null;
  checks_performed: number;
  issues_found: number;
  issues_fixed: number;
  tickets_created: number;
}

interface BotFinding {
  id: string;
  severity: string;
  category: string;
  title: string;
  status: string;
  created_at: string;
}

export default function BotsAdminPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [executions, setExecutions] = useState<BotExecution[]>([]);
  const [findings, setFindings] = useState<BotFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadData();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // Load bots
      const { data: botsData } = await supabase
        .from('bots')
        .select('*')
        .order('name');

      // Load recent executions
      const { data: executionsData } = await supabase
        .from('bot_executions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(20);

      // Load active findings
      const { data: findingsData } = await supabase
        .from('bot_findings')
        .select('*')
        .in('status', ['new', 'investigating', 'fixing'])
        .order('created_at', { ascending: false })
        .limit(20);

      setBots(botsData || []);
      setExecutions(executionsData || []);
      setFindings(findingsData || []);
    } catch (error) {
      console.error('Failed to load bot data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const triggerBot = async (botName: string) => {
    try {
      const response = await fetch(`/api/bots/${botName}`, {
        method: 'POST'
      });

      if (response.ok) {
        alert(`${botName} triggered successfully`);
        loadData(true);
      } else {
        alert(`Failed to trigger ${botName}`);
      }
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'failure': return 'text-red-600 bg-red-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'disabled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-blue-700 bg-blue-100';
      case 'info': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bot system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🤖 Autonomous Bot System</h1>
            <p className="text-gray-600 mt-2">24/7 Monitoring, Self-Healing, and Automation</p>
          </div>
          <div className="flex items-center gap-4">
            {refreshing && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Refreshing...
              </div>
            )}
            <button
              onClick={() => loadData(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bot Status Cards */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bot Health Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bots.map((bot) => {
              const successRate = bot.total_runs > 0 
                ? Math.round((bot.successful_runs / bot.total_runs) * 100) 
                : 0;

              return (
                <div key={bot.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{bot.display_name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bot.status)}`}>
                      {bot.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Runs:</span>
                      <span className="font-medium">{bot.total_runs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium">{successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Time:</span>
                      <span className="font-medium">
                        {bot.avg_execution_time_ms ? `${Math.round(bot.avg_execution_time_ms)}ms` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Run:</span>
                      <span className="font-medium text-xs">
                        {bot.last_run_at 
                          ? new Date(bot.last_run_at).toLocaleTimeString() 
                          : 'Never'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerBot(bot.name)}
                    className="mt-4 w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                  >
                    Trigger Manually
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Executions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Executions</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fixed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {executions.map((execution) => {
                  const bot = bots.find(b => b.id === execution.bot_id);
                  return (
                    <tr key={execution.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bot?.display_name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(execution.status)}`}>
                          {execution.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {execution.execution_time_ms ? `${execution.execution_time_ms}ms` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {execution.checks_performed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {execution.issues_found}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {execution.issues_fixed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {execution.tickets_created}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Issues */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Issues</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {findings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-lg">✅ No active issues</p>
                <p className="text-sm mt-2">All systems are operating normally</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detected</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {findings.map((finding) => (
                    <tr key={finding.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{finding.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {finding.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(finding.status)}`}>
                          {finding.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(finding.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
