/**
 * ScreenEffects - Visual screen effects
 * 
 * Features:
 * - Screen shake
 * - Flash effects
 * - Slow motion
 * - Chromatic aberration
 * - Vignette intensity
 */

export default class ScreenEffects {
  constructor() {
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeX = 0;
    this.shakeY = 0;

    this.flashIntensity = 0;
    this.flashDuration = 0;
    this.flashColor = '#ffffff';

    this.slowMoActive = false;
    this.slowMoDuration = 0;
    this.timeScale = 1;
  }

  update(dt) {
    // Update screen shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      
      if (this.shakeDuration > 0) {
        this.shakeX = (Math.random() - 0.5) * this.shakeIntensity;
        this.shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      } else {
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeIntensity = 0;
      }
    }

    // Update flash
    if (this.flashDuration > 0) {
      this.flashDuration -= dt;
      this.flashIntensity = Math.max(0, this.flashDuration / 0.2);
    }

    // Update slow motion
    if (this.slowMoDuration > 0) {
      this.slowMoDuration -= dt;
      if (this.slowMoDuration <= 0) {
        this.slowMoActive = false;
        this.timeScale = 1;
      }
    }
  }

  shake(intensity = 10, duration = 0.5) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    this.shakeDuration = Math.max(this.shakeDuration, duration);
  }

  flash(color = '#ffffff', duration = 0.2) {
    this.flashColor = color;
    this.flashDuration = duration;
    this.flashIntensity = 1;
  }

  slowMotion(duration = 2, scale = 0.5) {
    this.slowMoActive = true;
    this.slowMoDuration = duration;
    this.timeScale = scale;
  }

  getShakeOffset() {
    return { x: this.shakeX, y: this.shakeY };
  }

  applyShake(ctx) {
    if (this.shakeDuration > 0) {
      ctx.translate(this.shakeX, this.shakeY);
    }
  }

  applyFlash(ctx, width, height) {
    if (this.flashDuration > 0 && this.flashIntensity > 0) {
      ctx.save();
      ctx.fillStyle = this.flashColor;
      ctx.globalAlpha = this.flashIntensity * 0.5;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  applyVignette(ctx, width, height, intensity = 0.3) {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 1.5
    );
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
    
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  getTimeScale() {
    return this.slowMoActive ? this.timeScale : 1;
  }

  isSlowMotionActive() {
    return this.slowMoActive;
  }
}
