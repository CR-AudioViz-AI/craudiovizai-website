import Enemy from '../entities/Enemy';

/**
 * WaveSystem - Manages enemy waves and spawning
 * 
 * Features:
 * - Progressive difficulty scaling
 * - Wave composition algorithms
 * - Boss waves every 5 waves
 * - Enemy variety increases over time
 */

export default class WaveSystem {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.currentWave = 1;
    this.enemiesThisWave = [];
    this.enemiesSpawned = 0;
    this.totalEnemiesThisWave = 0;
    this.spawnTimer = 0;
    this.spawnDelay = 0.5; // seconds between spawns
    this.waveDelay = 3; // seconds between waves
    this.waveTimer = 0;
    this.waveActive = false;
    this.allEnemiesDead = false;

    // Enemy type progression
    this.availableEnemies = ['basic', 'fast'];
  }

  startWave(waveNumber) {
    this.currentWave = waveNumber;
    this.waveActive = true;
    this.spawnTimer = 0;
    this.enemiesSpawned = 0;
    this.allEnemiesDead = false;

    // Update available enemy types based on wave
    this.updateAvailableEnemies();

    // Calculate wave composition
    const composition = this.getWaveComposition(waveNumber);
    this.totalEnemiesThisWave = composition.length;
    this.enemiesThisWave = composition;
  }

  updateAvailableEnemies() {
    const wave = this.currentWave;
    
    this.availableEnemies = ['basic', 'fast'];

    if (wave >= 3) this.availableEnemies.push('tank');
    if (wave >= 5) this.availableEnemies.push('kamikaze');
    if (wave >= 7) this.availableEnemies.push('sniper');
    if (wave >= 10) this.availableEnemies.push('circler');
    if (wave >= 12) this.availableEnemies.push('bomber');
    if (wave >= 15) this.availableEnemies.push('fortress');
    if (wave >= 18) this.availableEnemies.push('splitter');
    if (wave >= 20) this.availableEnemies.push('shielded');
  }

  getWaveComposition(waveNumber) {
    const composition = [];

    // Check if boss wave
    if (waveNumber % 5 === 0) {
      // Boss wave - return empty, boss will be handled separately
      return [];
    }

    // Base enemy count scales with wave
    const baseCount = 5 + Math.floor(waveNumber / 2);
    const count = Math.min(baseCount, 30); // Cap at 30 enemies per wave

    // Difficulty multiplier
    const difficultyFactor = Math.min(waveNumber / 20, 1);

    for (let i = 0; i < count; i++) {
      let type;

      // Weight enemy types by difficulty
      const rand = Math.random();
      
      if (rand < 0.4) {
        // Common enemies (40%)
        type = Math.random() < 0.5 ? 'basic' : 'fast';
      } else if (rand < 0.7 && this.availableEnemies.includes('tank')) {
        // Medium enemies (30%)
        const mediumTypes = ['tank', 'sniper', 'kamikaze'].filter(t => 
          this.availableEnemies.includes(t)
        );
        type = mediumTypes[Math.floor(Math.random() * mediumTypes.length)];
      } else {
        // Advanced enemies (30%)
        const advancedTypes = ['circler', 'bomber', 'fortress', 'splitter', 'shielded'].filter(t => 
          this.availableEnemies.includes(t)
        );
        if (advancedTypes.length > 0) {
          type = advancedTypes[Math.floor(Math.random() * advancedTypes.length)];
        } else {
          type = 'basic';
        }
      }

      composition.push({
        type,
        delay: i * this.spawnDelay
      });
    }

    return composition;
  }

  update(dt, enemies) {
    if (!this.waveActive) {
      // Wait between waves
      this.waveTimer += dt;
      if (this.waveTimer >= this.waveDelay) {
        this.waveTimer = 0;
        return { spawnNext: true };
      }
      return { spawnNext: false };
    }

    // Update spawn timer
    this.spawnTimer += dt;

    // Check if all enemies spawned and all dead
    if (this.enemiesSpawned >= this.totalEnemiesThisWave) {
      const allDead = enemies.every(e => e.isDead || e.y > this.canvasHeight + 100);
      if (allDead && !this.allEnemiesDead) {
        this.allEnemiesDead = true;
        this.waveActive = false;
        return { waveComplete: true };
      }
    }

    return { spawnNext: false };
  }

  getNextEnemy() {
    if (this.enemiesSpawned >= this.enemiesThisWave.length) {
      return null;
    }

    const enemyData = this.enemiesThisWave[this.enemiesSpawned];
    
    if (this.spawnTimer >= enemyData.delay) {
      this.enemiesSpawned++;
      
      // Random spawn position at top
      const margin = 50;
      const x = margin + Math.random() * (this.canvasWidth - margin * 2);
      const y = -50;

      return new Enemy(x, y, enemyData.type);
    }

    return null;
  }

  isBossWave() {
    return this.currentWave % 5 === 0;
  }

  getCurrentWave() {
    return this.currentWave;
  }

  isWaveActive() {
    return this.waveActive;
  }
}
