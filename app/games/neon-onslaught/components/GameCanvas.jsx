'use client';

import { useRef, useEffect, useState } from 'react';
import GameEngine from '../utils/GameEngine';

/**
 * GameCanvas Component
 * 
 * Handles:
 * - Canvas setup and rendering
 * - Game engine initialization
 * - Input handling
 * - Animation loop
 */

export default function GameCanvas({
  gameState,
  selectedShip,
  onScoreUpdate,
  onWaveUpdate,
  onHealthUpdate,
  onComboUpdate,
  onGameOver
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Initialize game engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Create game engine instance
    engineRef.current = new GameEngine(canvas, ctx, {
      selectedShip,
      onScoreUpdate,
      onWaveUpdate,
      onHealthUpdate,
      onComboUpdate,
      onGameOver
    });

    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const width = Math.min(container.clientWidth, 1200);
      const height = Math.min(window.innerHeight - 200, 800);
      
      canvas.width = width;
      canvas.height = height;
      
      setDimensions({ width, height });
      
      if (engineRef.current) {
        engineRef.current.resize(width, height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start game loop
    engineRef.current.start();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [selectedShip]);

  // Handle game state changes
  useEffect(() => {
    if (!engineRef.current) return;

    if (gameState === 'playing') {
      engineRef.current.resume();
    } else if (gameState === 'paused') {
      engineRef.current.pause();
    }
  }, [gameState]);

  // Render loop
  useEffect(() => {
    if (!engineRef.current) return;

    const gameLoop = (timestamp) => {
      if (gameState === 'playing' && engineRef.current) {
        engineRef.current.update(timestamp);
        engineRef.current.render();
      }
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ 
          imageRendering: 'crisp-edges',
          cursor: 'crosshair'
        }}
      />
      
      {/* Canvas overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scan lines effect */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px)',
        }} />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />
      </div>
    </div>
  );
}
