'use client';

import { useState, useEffect } from 'react';
import gameDatabase from '../../utils/GameDatabase';

/**
 * Leaderboard Component
 * 
 * Displays top scores for the game
 */

export default function Leaderboard({ gameMode = 'story', limit = 10 }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all'); // all, daily, weekly
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [gameMode, timeframe]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);

    const result = await gameDatabase.getLeaderboard(gameMode, limit, timeframe);
    
    if (result.success) {
      setScores(result.data || []);
    } else {
      setError('Failed to load leaderboard');
      console.error(result.error);
    }
    
    setLoading(false);
  };

  const formatScore = (score) => {
    return score.toLocaleString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getRankColor = (index) => {
    if (index === 0) return 'text-yellow-400';
    if (index === 1) return 'text-gray-300';
    if (index === 2) return 'text-orange-400';
    return 'text-cyan-400';
  };

  const getRankMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Leaderboard</h3>
        <div className="text-center text-gray-400 py-8">
          Loading scores...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">Leaderboard</h3>
        <div className="text-center text-red-400 py-8">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-cyan-400">Leaderboard</h3>
        
        {/* Timeframe selector */}
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1 rounded ${
              timeframe === 'all' 
                ? 'bg-cyan-500 text-black' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 rounded ${
              timeframe === 'weekly' 
                ? 'bg-cyan-500 text-black' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1 rounded ${
              timeframe === 'daily' 
                ? 'bg-cyan-500 text-black' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Daily
          </button>
        </div>
      </div>

      {/* Scores list */}
      {scores.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No scores yet. Be the first!
        </div>
      ) : (
        <div className="space-y-2">
          {scores.map((score, index) => (
            <div
              key={score.id}
              className={`flex items-center justify-between p-3 rounded ${
                index < 3 
                  ? 'bg-gray-800/50 border border-cyan-500/20' 
                  : 'bg-gray-800/30'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center gap-3 flex-1">
                <span className={`text-lg font-bold ${getRankColor(index)} w-8`}>
                  {getRankMedal(index) || `#${index + 1}`}
                </span>
                
                {/* Player info */}
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {score.player_name}
                  </div>
                  <div className="text-xs text-gray-400">
                    Wave {score.wave_reached} • {score.ship_type}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-lg font-bold text-cyan-400">
                  {formatScore(score.score)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(score.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh button */}
      <div className="mt-4 text-center">
        <button
          onClick={loadLeaderboard}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
