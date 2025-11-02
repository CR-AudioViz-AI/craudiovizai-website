'use client';

import { useState, useEffect } from 'react';

/**
 * Settings Component
 * 
 * Handles:
 * - Audio volume
 * - Music volume
 * - Controls configuration
 * - Visual effects toggle
 */

export default function Settings({ onClose, audioManager }) {
  const [soundVolume, setSoundVolume] = useState(50);
  const [musicVolume, setMusicVolume] = useState(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [screenShake, setScreenShake] = useState(true);
  const [particles, setParticles] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('neon_onslaught_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSoundVolume(settings.soundVolume || 50);
      setMusicVolume(settings.musicVolume || 30);
      setSoundEnabled(settings.soundEnabled !== false);
      setScreenShake(settings.screenShake !== false);
      setParticles(settings.particles !== false);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      soundVolume,
      musicVolume,
      soundEnabled,
      screenShake,
      particles
    };

    localStorage.setItem('neon_onslaught_settings', JSON.stringify(settings));

    // Apply audio settings
    if (audioManager) {
      audioManager.setVolume(soundVolume / 100);
      audioManager.setMusicVolume(musicVolume / 100);
      if (!soundEnabled) {
        audioManager.toggle();
      }
    }

    onClose();
  };

  const handleSoundVolumeChange = (e) => {
    const value = parseInt(e.target.value);
    setSoundVolume(value);
    
    if (audioManager) {
      audioManager.setVolume(value / 100);
      audioManager.play('hit', 1); // Test sound
    }
  };

  const handleMusicVolumeChange = (e) => {
    const value = parseInt(e.target.value);
    setMusicVolume(value);
    
    if (audioManager) {
      audioManager.setMusicVolume(value / 100);
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    
    if (audioManager) {
      if (newValue) {
        audioManager.enabled = true;
      } else {
        audioManager.enabled = false;
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border-2 border-cyan-500/50 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Settings</h2>

        <div className="space-y-6">
          {/* Audio Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Audio</h3>
            
            {/* Sound Enabled Toggle */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Sound Effects</span>
              <button
                onClick={toggleSound}
                className={`px-4 py-2 rounded transition-colors ${
                  soundEnabled
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Sound Volume */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Sound Volume</span>
                <span>{soundVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolume}
                onChange={handleSoundVolumeChange}
                disabled={!soundEnabled}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Music Volume */}
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Music Volume</span>
                <span>{musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={handleMusicVolumeChange}
                disabled={!soundEnabled}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* Visual Effects Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Visual Effects</h3>
            
            {/* Screen Shake */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Screen Shake</span>
              <button
                onClick={() => setScreenShake(!screenShake)}
                className={`px-4 py-2 rounded transition-colors ${
                  screenShake
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {screenShake ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Particles */}
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Particles</span>
              <button
                onClick={() => setParticles(!particles)}
                className={`px-4 py-2 rounded transition-colors ${
                  particles
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {particles ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Controls Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Controls</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex justify-between">
                <span>Move:</span>
                <span className="text-cyan-400">WASD / Arrow Keys</span>
              </div>
              <div className="flex justify-between">
                <span>Shoot:</span>
                <span className="text-cyan-400">SPACE</span>
              </div>
              <div className="flex justify-between">
                <span>Pause:</span>
                <span className="text-cyan-400">ESC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={saveSettings}
            className="flex-1 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded transition-colors"
          >
            Save & Close
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
