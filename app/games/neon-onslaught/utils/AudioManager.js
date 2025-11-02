/**
 * AudioManager - Handles all game audio
 * 
 * Features:
 * - Sound effects with Web Audio API
 * - Music tracks
 * - Volume control
 * - Audio sprite support
 */

export default class AudioManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.5;
    this.musicVolume = 0.3;
    
    // Audio context
    this.audioContext = null;
    this.initAudioContext();
    
    // Sound cache
    this.sounds = {};
    this.music = null;
    
    // Initialize sounds
    this.initSounds();
  }

  initAudioContext() {
    try {
      // Create audio context (with vendor prefixes)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
      this.enabled = false;
    }
  }

  initSounds() {
    // Generate procedural sound effects using Web Audio API
    // This avoids loading external audio files
    
    this.sounds = {
      shoot: this.createShootSound.bind(this),
      explosion: this.createExplosionSound.bind(this),
      hit: this.createHitSound.bind(this),
      powerup: this.createPowerUpSound.bind(this),
      boss: this.createBossSound.bind(this),
      death: this.createDeathSound.bind(this)
    };
  }

  play(soundName, pitch = 1) {
    if (!this.enabled || !this.audioContext) return;

    try {
      if (this.sounds[soundName]) {
        this.sounds[soundName](pitch);
      }
    } catch (e) {
      console.warn('Error playing sound:', soundName, e);
    }
  }

  // Procedural sound generation
  createShootSound(pitch = 1) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Oscillator for laser sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(800 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(400 * pitch, now + 0.1);
    
    gain.gain.setValueAtTime(this.volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  createExplosionSound(pitch = 1) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // White noise for explosion
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000 / pitch, now);
    filter.frequency.exponentialRampToValueAtTime(100 / pitch, now + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.5);
  }

  createHitSound(pitch = 1) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(1000 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(50 * pitch, now + 0.08);
    
    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  createPowerUpSound(pitch = 1) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Ascending arpeggio
    const frequencies = [523, 659, 784, 1047].map(f => f * pitch);
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const time = now + i * 0.05;
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(this.volume * 0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

      osc.start(time);
      osc.stop(time + 0.1);
    });
  }

  createBossSound(pitch = 1) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Deep rumble
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(80 * pitch, now);
    osc.frequency.linearRampToValueAtTime(40 * pitch, now + 1);
    
    gain.gain.setValueAtTime(this.volume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1);

    osc.start(now);
    osc.stop(now + 1);
  }

  createDeathSound(pitch = 1) {
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Descending tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(800 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(50 * pitch, now + 0.8);
    
    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    osc.start(now);
    osc.stop(now + 0.8);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}
