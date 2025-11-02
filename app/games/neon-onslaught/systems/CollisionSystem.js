/**
 * CollisionSystem - Efficient collision detection
 * 
 * Features:
 * - Circle-circle collision
 * - Spatial partitioning (grid-based)
 * - Broad-phase culling
 */

export default class CollisionSystem {
  constructor(width, height, cellSize = 100) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.cols = Math.ceil(width / cellSize);
    this.rows = Math.ceil(height / cellSize);
    this.grid = [];
    this.initGrid();
  }

  initGrid() {
    this.grid = [];
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.grid[i] = [];
    }
  }

  clear() {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = [];
    }
  }

  getCellIndex(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
      return -1;
    }
    
    return row * this.cols + col;
  }

  insert(entity) {
    const bounds = entity.getBounds ? entity.getBounds() : {
      centerX: entity.x,
      centerY: entity.y,
      radius: (entity.width || 10) / 2
    };

    const cellIndex = this.getCellIndex(bounds.centerX, bounds.centerY);
    if (cellIndex >= 0 && cellIndex < this.grid.length) {
      this.grid[cellIndex].push(entity);
    }
  }

  getNearby(entity) {
    const bounds = entity.getBounds ? entity.getBounds() : {
      centerX: entity.x,
      centerY: entity.y,
      radius: (entity.width || 10) / 2
    };

    const cellIndex = this.getCellIndex(bounds.centerX, bounds.centerY);
    if (cellIndex < 0 || cellIndex >= this.grid.length) {
      return [];
    }

    const nearby = [...this.grid[cellIndex]];

    // Check adjacent cells
    const col = cellIndex % this.cols;
    const row = Math.floor(cellIndex / this.cols);

    const adjacentCells = [
      [col - 1, row - 1], [col, row - 1], [col + 1, row - 1],
      [col - 1, row],                      [col + 1, row],
      [col - 1, row + 1], [col, row + 1], [col + 1, row + 1]
    ];

    for (const [c, r] of adjacentCells) {
      if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
        const idx = r * this.cols + c;
        nearby.push(...this.grid[idx]);
      }
    }

    return nearby;
  }

  circleCollision(a, b) {
    const boundsA = a.getBounds ? a.getBounds() : {
      centerX: a.x,
      centerY: a.y,
      radius: (a.width || 10) / 2
    };

    const boundsB = b.getBounds ? b.getBounds() : {
      centerX: b.x,
      centerY: b.y,
      radius: (b.width || 10) / 2
    };

    const dx = boundsA.centerX - boundsB.centerX;
    const dy = boundsA.centerY - boundsB.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = boundsA.radius + boundsB.radius;

    return distance < minDistance;
  }

  checkCollisions(groupA, groupB, callback) {
    this.clear();

    // Insert groupB into grid
    for (const entity of groupB) {
      if (!entity.isDead) {
        this.insert(entity);
      }
    }

    // Check groupA against nearby entities in groupB
    const collisions = [];

    for (const entityA of groupA) {
      if (entityA.isDead) continue;

      const nearby = this.getNearby(entityA);

      for (const entityB of nearby) {
        if (entityB.isDead) continue;
        if (this.circleCollision(entityA, entityB)) {
          collisions.push({ a: entityA, b: entityB });
          if (callback) {
            callback(entityA, entityB);
          }
        }
      }
    }

    return collisions;
  }

  pointInCircle(px, py, circle) {
    const bounds = circle.getBounds ? circle.getBounds() : {
      centerX: circle.x,
      centerY: circle.y,
      radius: (circle.width || 10) / 2
    };

    const dx = px - bounds.centerX;
    const dy = py - bounds.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < bounds.radius;
  }
}
