/**
 * ObjectPool - Reusable object pool for performance
 * 
 * Prevents garbage collection by reusing objects
 * Critical for bullets and particles
 */

export class ObjectPool {
  constructor(createFn, initialSize = 100) {
    this.createFn = createFn;
    this.pool = [];
    this.active = [];

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  acquire() {
    let obj;
    
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFn();
    }

    this.active.push(obj);
    return obj;
  }

  release(obj) {
    const index = this.active.indexOf(obj);
    if (index !== -1) {
      this.active.splice(index, 1);
      this.pool.push(obj);
    }
  }

  releaseAll() {
    this.pool.push(...this.active);
    this.active = [];
  }

  getActiveCount() {
    return this.active.length;
  }

  getPoolSize() {
    return this.pool.length;
  }
}
