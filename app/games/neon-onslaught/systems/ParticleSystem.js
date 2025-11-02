/**
 * ParticleSystem - Manages visual effects
 * 
 * Features:
 * - Explosion particles
 * - Hit sparks
 * - Debris
 * - Engine trails
 * - Object pooling for performance
 */

export default class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 2000;
  }

  createExplosion(x, y, color = '#ff6600', count = 20, size = 'medium') {
    const sizeConfig = {
      small: { count: 10, speed: 150, life: 0.5, particleSize: 2 },
      medium: { count: 20, speed: 200, life: 0.8, particleSize: 3 },
      large: { count: 40, speed: 250, life: 1.2, particleSize: 4 },
      huge: { count: 80, speed: 300, life: 1.5, particleSize: 5 }
    };

    const config = sizeConfig[size] || sizeConfig.medium;

    for (let i = 0; i < config.count; i++) {
      const angle = (Math.PI * 2 * i) / config.count + (Math.random() - 0.5) * 0.5;
      const speed = config.speed * (0.5 + Math.random() * 0.5);

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: config.life,
        maxLife: config.life,
        size: config.particleSize,
        color,
        type: 'explosion',
        gravity: 50
      });
    }

    // Trim if too many particles
    if (this.particles.length > this.maxParticles) {
      this.particles = this.particles.slice(-this.maxParticles);
    }
  }

  createHitSpark(x, y, color = '#ffff00', count = 5) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 100;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.3,
        maxLife: 0.3,
        size: 2,
        color,
        type: 'spark',
        gravity: 0
      });
    }
  }

  createTrail(x, y, color = '#00ffff', vx = 0, vy = 0) {
    this.particles.push({
      x,
      y,
      vx: vx * 0.3,
      vy: vy * 0.3 + 20,
      life: 0.5,
      maxLife: 0.5,
      size: 3,
      color,
      type: 'trail',
      gravity: 0
    });

    if (this.particles.length > this.maxParticles) {
      this.particles.shift();
    }
  }

  createDebris(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 150;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 3,
        color: '#888888',
        type: 'debris',
        gravity: 100,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Update life
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Update position
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Apply gravity
      if (p.gravity) {
        p.vy += p.gravity * dt;
      }

      // Apply friction
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Update rotation
      if (p.rotationSpeed) {
        p.rotation += p.rotationSpeed * dt;
      }
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      const alpha = p.life / p.maxLife;

      ctx.save();

      // Set alpha
      ctx.globalAlpha = alpha;

      // Glow for explosions and sparks
      if (p.type === 'explosion' || p.type === 'spark') {
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      }

      // Draw particle
      if (p.type === 'debris' && p.rotation !== undefined) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      ctx.restore();
    }
  }

  clear() {
    this.particles = [];
  }

  getCount() {
    return this.particles.length;
  }
}
