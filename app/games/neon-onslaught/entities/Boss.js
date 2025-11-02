/**
 * Boss Class - Epic multi-phase boss encounters
 * 
 * Features:
 * - Multiple unique bosses
 * - Multi-phase mechanics (changes at health thresholds)
 * - Complex attack patterns
 * - Telegraphed attacks
 * - Special abilities
 */

export default class Boss {
  constructor(x, y, type = 'guardian', waveNumber = 5) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.waveNumber = waveNumber;

    // Get boss stats
    const stats = this.getBossStats(type, waveNumber);
    
    this.width = stats.width;
    this.height = stats.height;
    this.health = stats.health;
    this.maxHealth = stats.health;
    this.damage = stats.damage;
    this.speed = stats.speed;
    this.scoreValue = stats.scoreValue;
    this.color = stats.color;
    this.name = stats.name;

    // Movement
    this.vx = 0;
    this.vy = 50; // Enter from top
    this.angle = 0;
    this.targetY = 150; // Stop position

    // Combat
    this.phase = 1;
    this.maxPhases = stats.maxPhases || 3;
    this.attackTimer = 0;
    this.attackDelay = 2;
    this.attackPattern = 0;

    // State
    this.isDead = false;
    this.deathTimer = 0;
    this.age = 0;
    this.invulnerable = false; // During phase transitions
    this.invulnerableTimer = 0;

    // Entrance animation
    this.entering = true;
    this.entryComplete = false;
  }

  getBossStats(type, wave) {
    const baseHealth = 500 + (wave - 5) * 100;
    const baseDamage = 25 + Math.floor((wave - 5) / 5) * 5;

    const bosses = {
      guardian: {
        name: 'The Guardian',
        width: 80,
        height: 80,
        health: baseHealth,
        damage: baseDamage,
        speed: 80,
        scoreValue: 5000,
        color: '#ff0066',
        maxPhases: 3
      },
      destroyer: {
        name: 'The Destroyer',
        width: 100,
        height: 90,
        health: baseHealth * 1.2,
        damage: baseDamage * 1.3,
        speed: 60,
        scoreValue: 7500,
        color: '#ff6600',
        maxPhases: 3
      },
      sentinel: {
        name: 'The Sentinel',
        width: 70,
        height: 100,
        health: baseHealth * 0.8,
        damage: baseDamage * 0.9,
        speed: 120,
        scoreValue: 6000,
        color: '#00ff99',
        maxPhases: 4
      },
      colossus: {
        name: 'The Colossus',
        width: 120,
        height: 120,
        health: baseHealth * 1.5,
        damage: baseDamage * 1.5,
        speed: 40,
        scoreValue: 10000,
        color: '#9900ff',
        maxPhases: 3
      },
      phantom: {
        name: 'The Phantom',
        width: 60,
        height: 60,
        health: baseHealth * 0.7,
        damage: baseDamage * 1.1,
        speed: 150,
        scoreValue: 8000,
        color: '#00ffff',
        maxPhases: 5
      }
    };

    return bosses[type] || bosses.guardian;
  }

  update(dt, player, canvasWidth, canvasHeight) {
    if (this.isDead) {
      this.deathTimer += dt;
      return;
    }

    this.age += dt;

    // Entrance animation
    if (this.entering) {
      this.y += this.vy * dt;
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.entering = false;
        this.entryComplete = true;
        this.vy = 0;
      }
      return;
    }

    // Update invulnerability (phase transition)
    if (this.invulnerable) {
      this.invulnerableTimer -= dt;
      if (this.invulnerableTimer <= 0) {
        this.invulnerable = false;
      }
      return;
    }

    // Check phase transitions
    const healthPercent = this.health / this.maxHealth;
    const phaseThresholds = [1.0, 0.66, 0.33, 0.15];
    
    for (let i = 0; i < this.maxPhases; i++) {
      if (healthPercent <= phaseThresholds[i + 1] && this.phase === i + 1) {
        this.transitionPhase(i + 2);
        break;
      }
    }

    // Update attack timer
    this.attackTimer -= dt;

    // Movement pattern based on boss type
    this.updateMovement(dt, player, canvasWidth);
  }

  updateMovement(dt, player, canvasWidth) {
    switch (this.type) {
      case 'guardian':
        // Slow horizontal movement
        this.vx = Math.sin(this.age * 0.5) * this.speed;
        break;

      case 'destroyer':
        // Aggressive left-right sweeps
        this.vx = Math.sin(this.age * 1.5) * this.speed * 2;
        break;

      case 'sentinel':
        // Fast erratic movement
        this.vx = Math.sin(this.age * 3) * this.speed;
        this.vy = Math.sin(this.age * 2) * 30;
        break;

      case 'colossus':
        // Minimal movement
        this.vx = Math.sin(this.age * 0.3) * (this.speed * 0.5);
        break;

      case 'phantom':
        // Teleport-like movement
        if (Math.floor(this.age * 2) !== Math.floor((this.age - dt) * 2)) {
          this.x = 100 + Math.random() * (canvasWidth - 200);
        }
        this.vx = 0;
        break;
    }

    // Apply velocity
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Keep in bounds
    const margin = this.width / 2;
    this.x = Math.max(margin, Math.min(canvasWidth - margin, this.x));
    this.y = Math.max(50, Math.min(250, this.y));
  }

  transitionPhase(newPhase) {
    this.phase = newPhase;
    this.invulnerable = true;
    this.invulnerableTimer = 2; // 2 seconds of invulnerability
    this.attackDelay *= 0.8; // Attack faster each phase
  }

  getAttackPattern(playerX, playerY) {
    if (this.attackTimer > 0 || !this.entryComplete) return null;

    this.attackTimer = this.attackDelay;
    const bullets = [];

    // Different patterns per phase and boss type
    const patternId = `${this.type}_phase${this.phase}`;

    switch (patternId) {
      case 'guardian_phase1':
        // Simple aimed shots
        bullets.push(this.createAimedBullet(playerX, playerY, 250));
        break;

      case 'guardian_phase2':
        // Triple shot
        for (let i = -1; i <= 1; i++) {
          bullets.push(this.createAimedBullet(playerX + i * 100, playerY, 250));
        }
        break;

      case 'guardian_phase3':
        // Spiral pattern
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i / 8) + this.age;
          bullets.push(this.createBulletAtAngle(angle, 200));
        }
        break;

      case 'destroyer_phase1':
        // Spread shot
        for (let i = -2; i <= 2; i++) {
          bullets.push(this.createAimedBullet(playerX + i * 50, playerY, 300));
        }
        break;

      case 'destroyer_phase2':
        // Wave pattern
        for (let i = 0; i < 12; i++) {
          const angle = Math.PI / 2 + (i - 6) * 0.2;
          bullets.push(this.createBulletAtAngle(angle, 250));
        }
        break;

      case 'destroyer_phase3':
        // Rapid fire stream
        bullets.push(this.createAimedBullet(playerX, playerY, 400));
        this.attackDelay = 0.3;
        break;

      default:
        // Generic pattern
        bullets.push(this.createAimedBullet(playerX, playerY, 200));
    }

    return bullets;
  }

  createAimedBullet(targetX, targetY, speed) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const angle = Math.atan2(dy, dx);

    return {
      x: this.x,
      y: this.y + this.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      width: 10,
      height: 10,
      damage: this.damage,
      lifetime: 10,
      color: this.color,
      fromBoss: true
    };
  }

  createBulletAtAngle(angle, speed) {
    return {
      x: this.x,
      y: this.y + this.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      width: 10,
      height: 10,
      damage: this.damage,
      lifetime: 10,
      color: this.color,
      fromBoss: true
    };
  }

  takeDamage(amount) {
    if (this.isDead || this.invulnerable || this.entering) return false;

    this.health -= amount;

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      return true;
    }

    return false;
  }

  render(ctx) {
    if (this.isDead && this.deathTimer > 0.5) return;

    ctx.save();

    // Boss glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = this.color;

    // Flicker during phase transition
    if (this.invulnerable) {
      const flicker = Math.sin(Date.now() * 0.02) > 0;
      if (!flicker) {
        ctx.restore();
        return;
      }
    }

    // Draw boss body (large hexagon)
    ctx.fillStyle = this.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = this.x + Math.cos(angle) * (this.width / 2);
      const py = this.y + Math.sin(angle) * (this.height / 2);
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Boss core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Phase indicators
    for (let i = 0; i < this.maxPhases; i++) {
      const active = i < this.phase;
      ctx.fillStyle = active ? this.color : '#333333';
      const px = this.x - 20 + i * 15;
      const py = this.y - this.height / 2 - 15;
      ctx.fillRect(px, py, 10, 5);
    }

    // Health bar
    const barWidth = this.width;
    const barHeight = 6;
    const healthPercent = this.health / this.maxHealth;

    ctx.fillStyle = '#222222';
    ctx.fillRect(
      this.x - barWidth / 2,
      this.y + this.height / 2 + 15,
      barWidth,
      barHeight
    );

    ctx.fillStyle = healthPercent > 0.66 ? '#00ff00' : 
                     healthPercent > 0.33 ? '#ffaa00' : '#ff0000';
    ctx.fillRect(
      this.x - barWidth / 2,
      this.y + this.height / 2 + 15,
      barWidth * healthPercent,
      barHeight
    );

    // Boss name
    ctx.fillStyle = this.color;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.name, this.x, this.y - this.height / 2 - 30);

    ctx.restore();
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
      centerX: this.x,
      centerY: this.y,
      radius: Math.max(this.width, this.height) / 2
    };
  }
}
