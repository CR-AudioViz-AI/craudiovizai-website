'use client';

import { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import MainMenu from './components/ui/MainMenu';
import HUD from './components/ui/HUD';

/**
 * NEON ONSLAUGHT - Main Game Page
 * Fortune 50 Quality Bullet Hell Space Shooter
 * 
 * Game States:
 * - menu: Main menu screen
 * - playing: Active gameplay
 * - paused: Game paused
 * - gameover: Game over screen
 */

export default function NeonOnslaughtPage() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameover
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [combo, setCombo] = useState(0);
  const [selectedShip, setSelectedShip] = useState('interceptor');

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const startGame = (ship) => {
    setSelectedShip(ship);
    setScore(0);
    setWave(1);
    setHealth(100);
    setMaxHealth(100);
    setCombo(0);
    setGameState('playing');
  };

  const returnToMenu = () => {
    setGameState('menu');
  };

  const restartGame = () => {
    startGame(selectedShip);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900/20 via-black to-cyan-900/20" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="p-4 border-b border-cyan-500/30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              NEON ONSLAUGHT
            </h1>
            <div className="flex gap-4 text-sm text-gray-400">
              <span>High Score: 0</span>
              <span>|</span>
              <span>Wave Record: 1</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-6">
          {gameState === 'menu' && (
            <MainMenu onStartGame={startGame} />
          )}

          {(gameState === 'playing' || gameState === 'paused') && (
            <div className="space-y-4">
              {/* HUD */}
              <HUD 
                score={score}
                wave={wave}
                health={health}
                maxHealth={maxHealth}
                combo={combo}
              />

              {/* Game Canvas */}
              <div className="relative">
                <GameCanvas
                  gameState={gameState}
                  selectedShip={selectedShip}
                  onScoreUpdate={setScore}
                  onWaveUpdate={setWave}
                  onHealthUpdate={setHealth}
                  onComboUpdate={setCombo}
                  onGameOver={() => setGameState('gameover')}
                />

                {/* Pause Overlay */}
                {gameState === 'paused' && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center space-y-6">
                      <h2 className="text-4xl font-bold text-cyan-400">PAUSED</h2>
                      <div className="space-y-3">
                        <button
                          onClick={() => setGameState('playing')}
                          className="block w-64 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded transition-colors"
                        >
                          Resume
                        </button>
                        <button
                          onClick={returnToMenu}
                          className="block w-64 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-colors"
                        >
                          Return to Menu
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm">Press ESC to resume</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Info */}
              <div className="text-center text-sm text-gray-500 space-y-1">
                <p>WASD / Arrow Keys: Move | Space: Shoot | ESC: Pause</p>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="text-center space-y-8 py-20">
              <h2 className="text-6xl font-bold text-red-400">GAME OVER</h2>
              <div className="space-y-2">
                <p className="text-3xl">Final Score: <span className="text-cyan-400">{score.toLocaleString()}</span></p>
                <p className="text-xl text-gray-400">Wave Reached: {wave}</p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={restartGame}
                  className="block w-64 mx-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={returnToMenu}
                  className="block w-64 mx-auto px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-colors"
                >
                  Return to Menu
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
