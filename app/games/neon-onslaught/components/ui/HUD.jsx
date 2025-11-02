'use client';

/**
 * HUD Component - Heads Up Display
 * 
 * Displays:
 * - Health bar
 * - Score
 * - Wave number
 * - Combo counter
 */

export default function HUD({ score, wave, health, maxHealth, combo }) {
  const healthPercent = (health / maxHealth) * 100;

  return (
    <div className="bg-black/80 border border-cyan-500/30 rounded-lg p-4 backdrop-blur-sm">
      <div className="grid grid-cols-4 gap-6">
        {/* Health */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">HEALTH</span>
            <span className="text-sm font-bold text-white">{health}/{maxHealth}</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                healthPercent > 60 ? 'bg-green-500' :
                healthPercent > 30 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ 
                width: `${healthPercent}%`,
                boxShadow: healthPercent > 30 ? '0 0 10px currentColor' : 'none'
              }}
            />
          </div>
        </div>

        {/* Score */}
        <div className="space-y-1">
          <div className="text-sm text-gray-400">SCORE</div>
          <div className="text-2xl font-bold text-cyan-400">
            {score.toLocaleString()}
          </div>
        </div>

        {/* Wave */}
        <div className="space-y-1">
          <div className="text-sm text-gray-400">WAVE</div>
          <div className="text-2xl font-bold text-purple-400">
            {wave}
          </div>
        </div>

        {/* Combo */}
        <div className="space-y-1">
          <div className="text-sm text-gray-400">COMBO</div>
          <div className={`text-2xl font-bold transition-all ${
            combo > 10 ? 'text-red-400 animate-pulse' :
            combo > 5 ? 'text-yellow-400' :
            combo > 0 ? 'text-green-400' :
            'text-gray-600'
          }`}>
            {combo > 0 ? `x${combo}` : 'x0'}
          </div>
        </div>
      </div>
    </div>
  );
}
