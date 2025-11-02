import Player from '../entities/Player';
import Enemy from '../entities/Enemy';
import Boss from '../entities/Boss';
import PowerUp from '../entities/PowerUp';
import InputManager from './InputManager';
import CollisionSystem from '../systems/CollisionSystem';
import ParticleSystem from '../systems/ParticleSystem';
import WaveSystem from '../systems/WaveSystem';
import { ObjectPool } from './ObjectPool';

/**
 * GameEngine - Core game loop and entity management
 * 
 * Responsibilities:
 * - Delta time management
 * - Entity updates and rendering
 * - Collision detection
 * - Game state management
 * - Performance monitoring
 */

export default class GameEngine {
  constructor(canvas, ctx, callbacks) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.callbacks = callbacks;

    // Dimensions
    this.width = canvas.width;
    this.height = canvas.height;

    // Time management
    this.lastTimestamp = 0;
    this.deltaTime = 0;
    this.fps = 60;
    this.fpsSmoothing = 0.9;

    // Game state
    this.running = false;
    this.paused = false;

    // Entities
    this.player = null;
    this.enemies = [];
    this.bullets = [];
    this.enemyBullets = [];
    this.powerUps = [];
    this.boss = null;

    // Systems
    this.input = new InputManager(canvas);
    this.collision = new CollisionSystem(canvas.width, canvas.height);
    this.particles = new ParticleSystem();
    this.waves = new WaveSystem(canvas.width, canvas.height);

    // Stats
    this.score = 0;
    this.wave = 1;
    this.combo = 0;
    this.comboTimer = 0;
    this.comboDecayTime = 3000; // 3 seconds

    // Object pools for performance
    this.bulletPool = new ObjectPool(() => ({}), 500);
    this.particlePool = new ObjectPool(() => ({}), 1000);

    // Initialize
    this.init();
  }

  init() {
    // Create player
    this.player = new Player(
      this.width / 2,
      this.height - 100,
      this.callbacks.selectedShip
    );

    // Initial state
    this.score = 0;
    this.wave = 1;
    this.combo = 0;
    this.enemies = [];
    this.bullets = [];
    this.enemyBullets = [];
    this.boss = null;

    // Start wave system
    this.waves.startWave(1);

    // Update callbacks
    this.updateCallbacks();
  }

  start() {
    this.running = true;
    this.paused = false;
  }

  stop() {
    this.running = false;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.collision = new CollisionSystem(width, height);
    this.waves = new WaveSystem(width, height);
  }

  update(timestamp) {
    if (!this.running || this.paused) return;

    // Calculate delta time (in seconds)
    if (this.lastTimestamp === 0) {
      this.lastTimestamp = timestamp;
      return;
    }

    const rawDelta = (timestamp - this.lastTimestamp) / 1000;
    this.deltaTime = Math.min(rawDelta, 0.1); // Cap at 100ms to prevent spiral of death
    this.lastTimestamp = timestamp;

    // Update FPS counter
    const currentFps = 1 / this.deltaTime;
    this.fps = this.fps * this.fpsSmoothing + currentFps * (1 - this.fpsSmoothing);

    // Update game logic
    this.updateGame();
  }

  updateGame() {
    const dt = this.deltaTime;

    // Update wave system
    const waveUpdate = this.waves.update(dt, this.enemies);
    if (waveUpdate.waveComplete && !this.boss) {
      this.wave++;
      this.callbacks.onWaveUpdate(this.wave);
      
      // Check if next wave is boss wave
      if (this.wave % 5 === 0) {
        // Spawn boss
        this.spawnBoss();
      } else {
        this.waves.startWave(this.wave);
      }
    }

    // Spawn enemies (if not boss wave)
    if (this.waves.isWaveActive() && !this.boss) {
      const newEnemy = this.waves.getNextEnemy();
      if (newEnemy) {
        this.enemies.push(newEnemy);
      }
    }

    // Update boss
    if (this.boss && !this.boss.isDead) {
      this.boss.update(dt, this.player, this.width, this.height);
      
      // Boss attacks
      const bossAttack = this.boss.getAttackPattern(
        this.player ? this.player.x : this.width / 2,
        this.player ? this.player.y : this.height / 2
      );
      
      if (bossAttack) {
        this.enemyBullets.push(...bossAttack);
      }
    } else if (this.boss && this.boss.isDead && this.boss.deathTimer > 3) {
      // Boss defeated, continue to next wave
      this.boss = null;
      this.wave++;
      this.callbacks.onWaveUpdate(this.wave);
      this.waves.startWave(this.wave);
    }

    // Update player
    if (this.player && !this.player.isDead) {
      this.player.update(dt, this.input, this.width, this.height);

      // Player shooting
      if (this.input.isKeyDown('Space') || this.input.isKeyDown(' ')) {
        const bullet = this.player.shoot(dt);
        if (bullet) {
          this.bullets.push(bullet);
          // Create muzzle flash
          this.particles.createTrail(bullet.x, bullet.y, this.player.color, 0, -100);
        }
      }
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt, this.player, this.width, this.height);

      // Enemy shooting
      if (!enemy.isDead && this.player && !this.player.isDead) {
        const bullet = enemy.shoot(this.player.x, this.player.y);
        if (bullet) {
          this.enemyBullets.push(bullet);
        }
      }

      // Random power-up drop on death
      if (enemy.isDead && enemy.deathTimer === 0) {
        if (Math.random() < 0.15) { // 15% drop chance
          this.spawnPowerUp(enemy.x, enemy.y);
        }
      }

      // Remove dead enemies after animation
      if (enemy.isDead && enemy.deathTimer > 0.5) {
        this.enemies.splice(i, 1);
      }
    }

    // Update power-ups
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const powerUp = this.powerUps[i];
      powerUp.update(dt, this.height);
      
      if (powerUp.collected || powerUp.lifetime <= 0) {
        this.powerUps.splice(i, 1);
      }
    }

    // Update player bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.y -= bullet.speed * dt;
      bullet.lifetime -= dt;
      return bullet.y > -50 && bullet.lifetime > 0;
    });

    // Update enemy bullets
    this.enemyBullets = this.enemyBullets.filter(bullet => {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.lifetime -= dt;
      return bullet.x > -50 && bullet.x < this.width + 50 && 
             bullet.y > -50 && bullet.y < this.height + 50 && 
             bullet.lifetime > 0;
    });

    // Update particles
    this.particles.update(dt);

    // Collision detection
    this.handleCollisions();

    // Update combo timer
    if (this.combo > 0) {
      this.comboTimer -= dt * 1000;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.callbacks.onComboUpdate(0);
      }
    }

    // Check player death
    if (this.player && this.player.isDead) {
      // Death animation
      if (this.player.deathTimer === 0) {
        this.particles.createExplosion(this.player.x, this.player.y, this.player.color, 80, 'huge');
      }
      this.player.deathTimer = (this.player.deathTimer || 0) + dt;
      
      if (this.player.deathTimer > 2) {
        this.callbacks.onGameOver();
      }
    }

    // Update callbacks
    this.updateCallbacks();
  }

  handleCollisions() {
    // Player bullets vs enemies
    this.collision.checkCollisions(this.bullets, this.enemies, (bullet, enemy) => {
      if (!bullet.destroyed && !enemy.isDead) {
        bullet.destroyed = true;
        bullet.lifetime = 0;
        
        const killed = enemy.takeDamage(bullet.damage);
        
        if (killed) {
          // Enemy killed
          this.addScore(enemy.scoreValue);
          this.particles.createExplosion(enemy.x, enemy.y, enemy.color, 'medium');
          this.particles.createDebris(enemy.x, enemy.y, 6);
        } else {
          // Hit but not killed
          this.particles.createHitSpark(enemy.x, enemy.y, '#ffff00', 3);
        }
      }
    });

    // Player bullets vs boss
    if (this.boss && !this.boss.isDead) {
      this.collision.checkCollisions(this.bullets, [this.boss], (bullet, boss) => {
        if (!bullet.destroyed) {
          bullet.destroyed = true;
          bullet.lifetime = 0;
          
          const killed = boss.takeDamage(bullet.damage);
          
          if (killed) {
            // Boss killed
            this.addScore(boss.scoreValue);
            this.particles.createExplosion(boss.x, boss.y, boss.color, 80, 'huge');
            this.particles.createDebris(boss.x, boss.y, 20);
            
            // Boss always drops power-up
            this.spawnPowerUp(boss.x, boss.y, true);
          } else {
            // Hit but not killed
            this.particles.createHitSpark(boss.x, boss.y, '#ffff00', 5);
          }
        }
      });
    }

    // Enemy bullets vs player
    if (this.player && !this.player.isDead && !this.player.invulnerable) {
      this.collision.checkCollisions([this.player], this.enemyBullets, (player, bullet) => {
        if (!bullet.destroyed) {
          bullet.destroyed = true;
          bullet.lifetime = 0;
          player.takeDamage(bullet.damage);
          this.particles.createHitSpark(player.x, player.y, '#ff0000', 8);
          this.callbacks.onHealthUpdate(player.health);
        }
      });
    }

    // Player vs enemies (collision damage)
    if (this.player && !this.player.isDead && !this.player.invulnerable) {
      this.collision.checkCollisions([this.player], this.enemies, (player, enemy) => {
        if (!enemy.isDead) {
          player.takeDamage(enemy.damage);
          enemy.takeDamage(999); // Kill enemy on collision
          this.particles.createExplosion(enemy.x, enemy.y, enemy.color, 'medium');
          this.callbacks.onHealthUpdate(player.health);
        }
      });
    }

    // Player vs boss (collision damage)
    if (this.boss && !this.boss.isDead && this.player && !this.player.isDead && !this.player.invulnerable) {
      if (this.collision.circleCollision(this.player, this.boss)) {
        this.player.takeDamage(this.boss.damage);
        this.particles.createExplosion(this.player.x, this.player.y, '#ff0000', 'medium');
        this.callbacks.onHealthUpdate(this.player.health);
      }
    }

    // Player vs power-ups
    if (this.player && !this.player.isDead) {
      this.collision.checkCollisions([this.player], this.powerUps, (player, powerUp) => {
        if (!powerUp.collected) {
          this.collectPowerUp(powerUp);
        }
      });
    }
  }

  spawnBoss() {
    const bossTypes = ['guardian', 'destroyer', 'sentinel', 'colossus', 'phantom'];
    const bossIndex = Math.floor((this.wave / 5) - 1) % bossTypes.length;
    const bossType = bossTypes[bossIndex];
    
    this.boss = new Boss(this.width / 2, -100, bossType, this.wave);
  }

  spawnPowerUp(x, y, guaranteed = false) {
    const powerUpTypes = ['health', 'shield', 'rapid_fire', 'slow_time', 'bomb', 'magnet', 'invincibility', 'multiplier'];
    
    let type;
    if (guaranteed) {
      // Boss drops - always good power-ups
      const goodTypes = ['shield', 'rapid_fire', 'invincibility', 'multiplier'];
      type = goodTypes[Math.floor(Math.random() * goodTypes.length)];
    } else {
      // Random drop - weighted towards common types
      const rand = Math.random();
      if (rand < 0.4) type = 'health';
      else if (rand < 0.6) type = 'shield';
      else if (rand < 0.75) type = 'rapid_fire';
      else type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    }
    
    this.powerUps.push(new PowerUp(x, y, type));
  }

  collectPowerUp(powerUp) {
    powerUp.collect();
    this.particles.createExplosion(powerUp.x, powerUp.y, powerUp.color, 'small');
    
    // Apply power-up effect
    switch (powerUp.type) {
      case 'health':
        if (this.player) {
          this.player.health = Math.min(this.player.maxHealth, this.player.health + powerUp.value);
          this.callbacks.onHealthUpdate(this.player.health);
        }
        break;
      
      case 'bomb':
        // Kill all enemies on screen
        this.enemies.forEach(enemy => {
          if (!enemy.isDead) {
            enemy.takeDamage(999);
            this.particles.createExplosion(enemy.x, enemy.y, enemy.color, 'medium');
            this.addScore(enemy.scoreValue);
          }
        });
        // Damage boss
        if (this.boss && !this.boss.isDead) {
          this.boss.takeDamage(100);
          this.particles.createExplosion(this.boss.x, this.boss.y, '#ff0000', 'huge');
        }
        break;
      
      // Other power-ups would be handled with an active effects system
      // For now, just visual feedback
      default:
        // TODO: Implement active effects system for timed power-ups
        break;
    }
  }

  render() {
    if (!this.ctx) return;

    const ctx = this.ctx;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw starfield background
    this.drawStarfield(ctx);

    // Draw grid overlay
    this.drawGrid(ctx);

    // Render enemy bullets
    this.enemyBullets.forEach(bullet => {
      this.drawEnemyBullet(ctx, bullet);
    });

    // Render particles (background layer)
    this.particles.render(ctx);

    // Render power-ups
    this.powerUps.forEach(powerUp => {
      powerUp.render(ctx);
    });

    // Render enemies
    this.enemies.forEach(enemy => {
      if (!enemy.isDead || enemy.deathTimer < 0.3) {
        enemy.render(ctx);
      }
    });

    // Render boss
    if (this.boss) {
      this.boss.render(ctx);
    }

    // Render player bullets
    this.bullets.forEach(bullet => {
      if (!bullet.destroyed) {
        this.drawBullet(ctx, bullet);
      }
    });

    // Render player
    if (this.player && !this.player.isDead) {
      this.player.render(ctx);
    }

    // Draw wave announcement
    if (this.boss && this.boss.entering) {
      this.drawBossAnnouncement(ctx);
    }

    // Draw debug info
    if (process.env.NODE_ENV === 'development') {
      this.drawDebugInfo(ctx);
    }
  }

  drawBossAnnouncement(ctx) {
    ctx.save();
    
    const alpha = Math.min(1, this.boss.age * 2);
    ctx.globalAlpha = alpha;
    
    // Background overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Boss warning
    ctx.fillStyle = '#ff0066';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff0066';
    ctx.fillText('⚠ BOSS WAVE ⚠', this.width / 2, this.height / 2 - 30);
    
    // Boss name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px monospace';
    ctx.fillText(this.boss.name, this.width / 2, this.height / 2 + 20);
    
    ctx.restore();
  }

  drawStarfield(ctx) {
    // Simple starfield - animated
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    
    const starCount = 100;
    const time = Date.now() * 0.0001;
    
    for (let i = 0; i < starCount; i++) {
      const x = (i * 137.5) % this.width;
      const y = ((i * 93.7 + time * 50) % this.height);
      const size = (i % 3) + 1;
      
      ctx.fillRect(x, y, size, size);
    }
  }

  drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 50;

    // Vertical lines
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
  }

  drawBullet(ctx, bullet) {
    // Neon bullet effect
    ctx.save();

    // Outer glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = bullet.color || '#00ffff';
    
    // Bullet body
    ctx.fillStyle = bullet.color || '#00ffff';
    ctx.fillRect(
      bullet.x - bullet.width / 2,
      bullet.y - bullet.height / 2,
      bullet.width,
      bullet.height
    );

    // Bullet trail
    const gradient = ctx.createLinearGradient(
      bullet.x,
      bullet.y,
      bullet.x,
      bullet.y + 20
    );
    gradient.addColorStop(0, bullet.color || '#00ffff');
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(
      bullet.x - bullet.width / 2,
      bullet.y,
      bullet.width,
      20
    );

    ctx.restore();
  }

  drawEnemyBullet(ctx, bullet) {
    ctx.save();

    // Red/orange bullets for enemies
    ctx.shadowBlur = 10;
    ctx.shadowColor = bullet.color || '#ff3300';
    
    ctx.fillStyle = bullet.color || '#ff3300';
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawDebugInfo(ctx) {
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px monospace';
    ctx.fillText(`FPS: ${Math.round(this.fps)}`, 10, 20);
    ctx.fillText(`Delta: ${(this.deltaTime * 1000).toFixed(2)}ms`, 10, 35);
    ctx.fillText(`Bullets: ${this.bullets.length}`, 10, 50);
    ctx.fillText(`Enemy Bullets: ${this.enemyBullets.length}`, 10, 65);
    ctx.fillText(`Enemies: ${this.enemies.length}`, 10, 80);
    ctx.fillText(`Particles: ${this.particles.getCount()}`, 10, 95);
    ctx.fillText(`Wave: ${this.wave}`, 10, 110);
  }

  updateCallbacks() {
    this.callbacks.onScoreUpdate(this.score);
    this.callbacks.onWaveUpdate(this.wave);
    this.callbacks.onHealthUpdate(this.player ? this.player.health : 0);
    this.callbacks.onComboUpdate(this.combo);
  }

  addScore(points) {
    const multiplier = Math.max(1, this.combo);
    this.score += points * multiplier;
    this.combo++;
    this.comboTimer = this.comboDecayTime;
    this.updateCallbacks();
  }
}
