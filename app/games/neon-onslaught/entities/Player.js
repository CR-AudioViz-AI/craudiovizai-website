/**
 * Player Ship Class
 * 
 * Handles:
 * - Movement with momentum
 * - Shooting with fire rate
 * - Ship type variations
 * - Health management
 * - Visual rendering
 */

export default class Player {
  constructor(x, y, shipType = 'interceptor') {
    this.x = x;
    this.y = y;
    this.shipType = shipType;

    // Get ship stats
    const stats = this.getShipStats(shipType);
    
    // Movement
    this.vx = 0;
    this.vy = 0;
    this.speed = stats.speed;
    this.acceleration = stats.acceleration;
    this.friction = 0.85;

    // Combat
    this.health = stats.health;
    this.maxHealth = stats.health;
    this.damage = stats.damage;
    this.fireRate = stats.fireRate; // shots per second
    this.fireTimer = 0;

    // Visuals
    this.width = 30;
    this.height = 40;
    this.color = stats.color;

    // State
    this.isDead = false;
    this.invulnerable = false;
    this.invulnerableTimer = 0;
    this.deathAnimationComplete = false;
  }

  getShipStats(type) {
    const ships = {
      interceptor: {
        speed: 400,
        acceleration: 1200,
        health: 100,
        damage: 10,
        fireRate: 10, // 10 shots per second
        color: '#00ffff'
      },
      titan: {
        speed: 250,
        acceleration: 800,
        health: 200,
        damage: 25,
        fireRate: 4,
        color: '#ff6600'
      },
      phantom: {
        speed: 450,
        acceleration: 1500,
        health: 75,
        damage: 15,
        fireRate: 8,
        color: '#9900ff'
      },
      valkyrie: {
        speed: 350,
        acceleration: 1000,
        health: 120,
        damage: 18,
        fireRate: 7,
        color: '#ff00ff'
      },
      nova: {
        speed: 300,
        acceleration: 1000,
        health: 60,
        damage: 30,
        fireRate: 5,
        color: '#ffff00'
      },
      eclipse: {
        speed: 320,
        acceleration: 900,
        health: 150,
        damage: 12,
        fireRate: 9,
        color: '#00ff99'
      }
    };

    return ships[type] || ships.interceptor;
  }

  update(dt, input, canvasWidth, canvasHeight) {
    if (this.isDead) return;

    // Handle input
    let ax = 0;
    let ay = 0;

    if (input.isKeyDown('ArrowLeft') || input.isKeyDown('a') || input.isKeyDown('A')) {
      ax -= 1;
    }
    if (input.isKeyDown('ArrowRight') || input.isKeyDown('d') || input.isKeyDown('D')) {
      ax += 1;
    }
    if (input.isKeyDown('ArrowUp') || input.isKeyDown('w') || input.isKeyDown('W')) {
      ay -= 1;
    }
    if (input.isKeyDown('ArrowDown') || input.isKeyDown('s') || input.isKeyDown('S')) {
      ay += 1;
    }

    // Normalize diagonal movement
    if (ax !== 0 && ay !== 0) {
      const magnitude = Math.sqrt(ax * ax + ay * ay);
      ax /= magnitude;
      ay /= magnitude;
    }

    // Apply acceleration
    this.vx += ax * this.acceleration * dt;
    this.vy += ay * this.acceleration * dt;

    // Apply friction
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Limit to max speed
    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (currentSpeed > this.speed) {
      const scale = this.speed / currentSpeed;
      this.vx *= scale;
      this.vy *= scale;
    }

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Keep player in bounds
    const margin = this.width / 2;
    this.x = Math.max(margin, Math.min(canvasWidth - margin, this.x));
    this.y = Math.max(margin, Math.min(canvasHeight - margin, this.y));

    // Update fire timer
    this.fireTimer -= dt;

    // Update invulnerability
    if (this.invulnerable) {
      this.invulnerableTimer -= dt;
      if (this.invulnerableTimer <= 0) {
        this.invulnerable = false;
      }
    }
  }

  shoot(dt) {
    if (this.fireTimer > 0) return null;

    // Reset fire timer
    this.fireTimer = 1 / this.fireRate;

    // Create bullet
    return {
      x: this.x,
      y: this.y - this.height / 2,
      width: 4,
      height: 12,
      speed: 600,
      damage: this.damage,
      lifetime: 3,
      color: this.color,
      fromPlayer: true
    };
  }

  takeDamage(amount) {
    if (this.invulnerable || this.isDead) return;

    this.health -= amount;

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      // Death animation will be handled in render
    } else {
      // Invulnerability frames
      this.invulnerable = true;
      this.invulnerableTimer = 1.5; // 1.5 seconds of invulnerability
    }
  }

  render(ctx) {
    if (this.isDead) return;

    ctx.save();

    // Flicker effect when invulnerable
    if (this.invulnerable) {
      const flicker = Math.sin(Date.now() * 0.02) > 0;
      if (!flicker) {
        ctx.restore();
        return;
      }
    }

    // Ship glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;

    // Draw ship body (triangle)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.height / 2); // Top point
    ctx.lineTo(this.x - this.width / 2, this.y + this.height / 2); // Bottom left
    ctx.lineTo(this.x + this.width / 2, this.y + this.height / 2); // Bottom right
    ctx.closePath();
    ctx.fill();

    // Draw ship outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw ship cockpit
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw engine trail
    const trailGradient = ctx.createLinearGradient(
      this.x,
      this.y + this.height / 2,
      this.x,
      this.y + this.height / 2 + 20
    );
    trailGradient.addColorStop(0, this.color);
    trailGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = trailGradient;
    ctx.fillRect(
      this.x - 4,
      this.y + this.height / 2,
      8,
      20
    );

    ctx.restore();
  }
}
