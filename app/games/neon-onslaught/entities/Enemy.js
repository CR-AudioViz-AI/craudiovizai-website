/**
 * Enemy Base Class
 * 
 * Features:
 * - Multiple enemy types with unique behaviors
 * - AI movement patterns
 * - Health and damage
 * - Drop tables (credits, power-ups)
 */

export default class Enemy {
  constructor(x, y, type = 'basic') {
    this.x = x;
    this.y = y;
    this.type = type;

    // Get type-specific stats
    const stats = this.getEnemyStats(type);
    
    this.width = stats.width;
    this.height = stats.height;
    this.health = stats.health;
    this.maxHealth = stats.health;
    this.damage = stats.damage;
    this.speed = stats.speed;
    this.scoreValue = stats.scoreValue;
    this.color = stats.color;
    this.behavior = stats.behavior;

    // Movement
    this.vx = 0;
    this.vy = stats.speed;
    this.angle = 0;

    // Shooting
    this.shootTimer = 0;
    this.shootDelay = stats.shootDelay || 2;

    // State
    this.isDead = false;
    this.deathTimer = 0;
    this.age = 0;

    // Behavior-specific
    this.targetX = x;
    this.targetY = y;
    this.behaviorTimer = 0;
    this.behaviorPhase = 0;
  }

  getEnemyStats(type) {
    const types = {
      // Basic enemies
      basic: {
        width: 25, height: 25, health: 20, damage: 10,
        speed: 80, scoreValue: 100, color: '#ff6666',
        behavior: 'straight', shootDelay: 2.5
      },
      fast: {
        width: 20, height: 20, health: 10, damage: 5,
        speed: 150, scoreValue: 150, color: '#ffaa00',
        behavior: 'zigzag', shootDelay: 3
      },
      tank: {
        width: 40, height: 40, health: 100, damage: 20,
        speed: 40, scoreValue: 300, color: '#00ff00',
        behavior: 'slow_straight', shootDelay: 1.5
      },
      kamikaze: {
        width: 22, height: 22, health: 15, damage: 30,
        speed: 200, scoreValue: 200, color: '#ff00ff',
        behavior: 'chase_player', shootDelay: 999
      },
      sniper: {
        width: 28, height: 28, health: 30, damage: 25,
        speed: 60, scoreValue: 250, color: '#0099ff',
        behavior: 'hover', shootDelay: 2
      },

      // Advanced enemies
      circler: {
        width: 30, height: 30, health: 40, damage: 15,
        speed: 100, scoreValue: 350, color: '#ffcc00',
        behavior: 'circle', shootDelay: 2
      },
      fortress: {
        width: 50, height: 50, health: 200, damage: 15,
        speed: 30, scoreValue: 500, color: '#ff0066',
        behavior: 'stationary', shootDelay: 1
      },
      bomber: {
        width: 35, height: 35, health: 60, damage: 20,
        speed: 70, scoreValue: 400, color: '#00ffcc',
        behavior: 'wave', shootDelay: 3
      },
      splitter: {
        width: 30, height: 30, health: 50, damage: 10,
        speed: 90, scoreValue: 300, color: '#cc00ff',
        behavior: 'split_on_death', shootDelay: 2.5
      },
      shielded: {
        width: 32, height: 32, health: 80, damage: 15,
        speed: 70, scoreValue: 450, color: '#00ffff',
        behavior: 'shielded', shootDelay: 2.2
      }
    };

    return types[type] || types.basic;
  }

  update(dt, player, canvasWidth, canvasHeight) {
    if (this.isDead) {
      this.deathTimer += dt;
      return;
    }

    this.age += dt;
    this.shootTimer -= dt;
    this.behaviorTimer += dt;

    // Update behavior
    this.updateBehavior(dt, player, canvasWidth, canvasHeight);

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Remove if off screen (bottom)
    if (this.y > canvasHeight + 100) {
      this.isDead = true;
    }
  }

  updateBehavior(dt, player, canvasWidth, canvasHeight) {
    switch (this.behavior) {
      case 'straight':
        this.vy = this.speed;
        this.vx = 0;
        break;

      case 'slow_straight':
        this.vy = this.speed;
        this.vx = 0;
        break;

      case 'zigzag':
        this.vy = this.speed * 0.7;
        this.vx = Math.sin(this.age * 3) * this.speed * 1.5;
        break;

      case 'chase_player':
        if (player && !player.isDead) {
          const dx = player.x - this.x;
          const dy = player.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0) {
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
          }
        }
        break;

      case 'hover':
        // Move to hover position then stay there
        if (this.behaviorPhase === 0) {
          this.vy = this.speed;
          if (this.y > canvasHeight * 0.25) {
            this.behaviorPhase = 1;
            this.targetX = this.x;
          }
        } else {
          this.vy = 0;
          // Slight horizontal sway
          this.vx = Math.sin(this.age * 2) * 30;
        }
        break;

      case 'circle':
        // Circle around a point
        if (this.behaviorPhase === 0) {
          this.vy = this.speed;
          if (this.y > canvasHeight * 0.3) {
            this.behaviorPhase = 1;
            this.targetX = this.x;
            this.targetY = this.y;
          }
        } else {
          const radius = 80;
          const angularSpeed = 2;
          this.angle += angularSpeed * dt;
          this.x = this.targetX + Math.cos(this.angle) * radius;
          this.y = this.targetY + Math.sin(this.angle) * radius;
          this.vx = 0;
          this.vy = 0;
        }
        break;

      case 'stationary':
        // Stop at top of screen
        if (this.y < canvasHeight * 0.2) {
          this.vy = 0;
          this.vx = 0;
        } else {
          this.vy = this.speed;
        }
        break;

      case 'wave':
        this.vy = this.speed * 0.8;
        this.vx = Math.sin(this.age * 2) * this.speed;
        break;

      case 'split_on_death':
        this.vy = this.speed;
        this.vx = Math.sin(this.age * 1.5) * 50;
        break;

      case 'shielded':
        this.vy = this.speed;
        this.vx = 0;
        break;

      default:
        this.vy = this.speed;
    }
  }

  shoot(playerX, playerY) {
    if (this.shootTimer > 0) return null;
    if (this.behavior === 'kamikaze') return null; // Kamikazes don't shoot

    this.shootTimer = this.shootDelay;

    // Aim at player
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let angle = 0;
    if (dist > 0) {
      angle = Math.atan2(dy, dx);
    }

    return {
      x: this.x,
      y: this.y + this.height / 2,
      vx: Math.cos(angle) * 200,
      vy: Math.sin(angle) * 200,
      width: 6,
      height: 6,
      damage: this.damage,
      lifetime: 5,
      color: this.color,
      fromEnemy: true
    };
  }

  takeDamage(amount) {
    if (this.isDead) return false;

    this.health -= amount;

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      return true; // Enemy killed
    }

    return false;
  }

  render(ctx) {
    if (this.isDead && this.deathTimer > 0.3) return;

    ctx.save();

    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;

    // Flicker when damaged
    if (this.health < this.maxHealth * 0.3) {
      const flicker = Math.sin(Date.now() * 0.03) > 0;
      if (!flicker) {
        ctx.restore();
        return;
      }
    }

    // Draw enemy based on type
    if (this.behavior === 'fortress' || this.behavior === 'stationary') {
      // Square fortress
      ctx.fillStyle = this.color;
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
    } else if (this.behavior === 'shielded') {
      // Enemy with shield
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Shield ring
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Standard enemy (inverted triangle)
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.height / 2); // Bottom point
      ctx.lineTo(this.x - this.width / 2, this.y - this.height / 2); // Top left
      ctx.lineTo(this.x + this.width / 2, this.y - this.height / 2); // Top right
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Health bar
    if (this.health < this.maxHealth) {
      const barWidth = this.width;
      const barHeight = 3;
      const healthPercent = this.health / this.maxHealth;

      // Background
      ctx.fillStyle = '#333333';
      ctx.fillRect(
        this.x - barWidth / 2,
        this.y - this.height / 2 - 10,
        barWidth,
        barHeight
      );

      // Health
      ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffaa00' : '#ff0000';
      ctx.fillRect(
        this.x - barWidth / 2,
        this.y - this.height / 2 - 10,
        barWidth * healthPercent,
        barHeight
      );
    }

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
