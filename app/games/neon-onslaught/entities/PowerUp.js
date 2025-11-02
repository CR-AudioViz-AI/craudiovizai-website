/**
 * PowerUp Class - Collectible power-ups
 * 
 * Types:
 * - shield: Absorb hits
 * - rapid_fire: Increased fire rate
 * - slow_time: Slow down time
 * - bomb: Screen-clearing explosion
 * - magnet: Auto-collect items
 * - invincibility: Temporary immunity
 * - multiplier: Score multiplier
 * - health: Restore health
 */

export default class PowerUp {
  constructor(x, y, type = 'health') {
    this.x = x;
    this.y = y;
    this.type = type;

    // Get type stats
    const stats = this.getPowerUpStats(type);
    
    this.width = 25;
    this.height = 25;
    this.color = stats.color;
    this.symbol = stats.symbol;
    this.duration = stats.duration;
    this.value = stats.value;

    // Movement
    this.vy = 100; // Fall speed
    this.vx = 0;

    // Visual
    this.age = 0;
    this.pulseScale = 1;

    // State
    this.collected = false;
    this.lifetime = 10; // Disappear after 10 seconds
  }

  getPowerUpStats(type) {
    const types = {
      health: {
        color: '#00ff00',
        symbol: '+',
        duration: 0,
        value: 25
      },
      shield: {
        color: '#00ffff',
        symbol: '◈',
        duration: 15,
        value: 3 // Number of hits to absorb
      },
      rapid_fire: {
        color: '#ff9900',
        symbol: '»',
        duration: 10,
        value: 2 // Multiplier
      },
      slow_time: {
        color: '#9900ff',
        symbol: '⧗',
        duration: 8,
        value: 0.5 // Time scale
      },
      bomb: {
        color: '#ff0000',
        symbol: '✸',
        duration: 0,
        value: 1
      },
      magnet: {
        color: '#ffff00',
        symbol: '⬢',
        duration: 12,
        value: 1
      },
      invincibility: {
        color: '#ff00ff',
        symbol: '★',
        duration: 5,
        value: 1
      },
      multiplier: {
        color: '#00ff99',
        symbol: 'x2',
        duration: 15,
        value: 2
      }
    };

    return types[type] || types.health;
  }

  update(dt, canvasHeight) {
    if (this.collected) return;

    this.age += dt;
    this.lifetime -= dt;

    // Move down
    this.y += this.vy * dt;

    // Pulse animation
    this.pulseScale = 1 + Math.sin(this.age * 5) * 0.2;

    // Remove if off screen or expired
    if (this.y > canvasHeight + 50 || this.lifetime <= 0) {
      this.collected = true; // Mark for removal
    }
  }

  render(ctx) {
    if (this.collected) return;

    ctx.save();

    // Glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;

    // Pulse
    const scale = this.pulseScale;

    // Draw background circle
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, (this.width / 2) * scale, 0, Math.PI * 2);
    ctx.fill();

    // Draw symbol
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${18 * scale}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.symbol, this.x, this.y);

    // Lifetime indicator
    if (this.lifetime < 3) {
      const alpha = Math.sin(this.age * 10) * 0.5 + 0.5;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();
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
      radius: this.width / 2
    };
  }

  collect() {
    this.collected = true;
  }
}
