'use client';

import { useState } from 'react';

/**
 * MainMenu Component
 * 
 * Features:
 * - Ship selection
 * - Game mode selection
 * - Instructions
 */

export default function MainMenu({ onStartGame }) {
  const [selectedShip, setSelectedShip] = useState('interceptor');
  const [showInstructions, setShowInstructions] = useState(false);

  const ships = [
    {
      id: 'interceptor',
      name: 'Interceptor',
      description: 'Fast and agile with rapid fire',
      stats: { speed: '★★★★★', health: '★★★☆☆', damage: '★★★☆☆' },
      color: '#00ffff'
    },
    {
      id: 'titan',
      name: 'Titan',
      description: 'Heavy armor and devastating firepower',
      stats: { speed: '★★☆☆☆', health: '★★★★★', damage: '★★★★★' },
      color: '#ff6600'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      description: 'Lightning fast with stealth capabilities',
      stats: { speed: '★★★★★', health: '★★☆☆☆', damage: '★★★★☆' },
      color: '#9900ff'
    }
  ];

  if (showInstructions) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-cyan-400">How to Play</h2>
        </div>

        <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-8 space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-cyan-300">Controls</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Move:</p>
                <p className="text-white">WASD or Arrow Keys</p>
              </div>
              <div>
                <p className="text-gray-400">Shoot:</p>
                <p className="text-white">Hold SPACE</p>
              </div>
              <div>
                <p className="text-gray-400">Pause:</p>
                <p className="text-white">ESC</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-cyan-300">Objective</h3>
            <p className="text-gray-300">
              Survive waves of enemies and destroy them to earn points. Each wave gets progressively harder.
              Build combos by destroying enemies quickly to increase your score multiplier. Face epic bosses every 5 waves!
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-cyan-300">Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Keep moving to avoid enemy fire</li>
              <li>Don't let your combo timer run out</li>
              <li>Collect power-ups to gain temporary advantages</li>
              <li>Learn enemy patterns and boss attack telegraphs</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowInstructions(false)}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          NEON ONSLAUGHT
        </h2>
        <p className="text-xl text-gray-400">Select Your Ship</p>
      </div>

      {/* Ship Selection */}
      <div className="grid md:grid-cols-3 gap-6">
        {ships.map(ship => (
          <button
            key={ship.id}
            onClick={() => setSelectedShip(ship.id)}
            className={`
              relative p-6 rounded-lg border-2 transition-all
              ${selectedShip === ship.id 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/50' 
                : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
              }
            `}
          >
            {/* Ship visual */}
            <div className="h-32 flex items-center justify-center mb-4">
              <div 
                className="w-16 h-20 relative"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  backgroundColor: ship.color,
                  boxShadow: `0 0 20px ${ship.color}`
                }}
              />
            </div>

            {/* Ship info */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold" style={{ color: ship.color }}>
                {ship.name}
              </h3>
              <p className="text-sm text-gray-400">
                {ship.description}
              </p>

              {/* Stats */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Speed:</span>
                  <span className="text-yellow-400">{ship.stats.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Health:</span>
                  <span className="text-green-400">{ship.stats.health}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Damage:</span>
                  <span className="text-red-400">{ship.stats.damage}</span>
                </div>
              </div>
            </div>

            {selectedShip === ship.id && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">✓</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => onStartGame(selectedShip)}
          className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white text-xl font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/50"
        >
          Start Game
        </button>
        <button
          onClick={() => setShowInstructions(true)}
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
        >
          How to Play
        </button>
      </div>
    </div>
  );
}
