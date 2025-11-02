/**
 * InputManager - Handles keyboard and mouse input
 * 
 * Features:
 * - Key state tracking
 * - Mouse position tracking
 * - Input buffering
 */

export default class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Map();
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Keyboard events
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.key, true);
      
      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.key, false);
    });

    // Mouse events
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.mouseDown = true;
      e.preventDefault();
    });

    this.canvas.addEventListener('mouseup', (e) => {
      this.mouseDown = false;
    });

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      this.mouseDown = true;
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.mouseX = touch.clientX - rect.left;
      this.mouseY = touch.clientY - rect.top;
      e.preventDefault();
    });

    this.canvas.addEventListener('touchmove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.mouseX = touch.clientX - rect.left;
      this.mouseY = touch.clientY - rect.top;
      e.preventDefault();
    });

    this.canvas.addEventListener('touchend', (e) => {
      this.mouseDown = false;
      e.preventDefault();
    });
  }

  isKeyDown(key) {
    return this.keys.get(key) || false;
  }

  isMouseDown() {
    return this.mouseDown;
  }

  getMousePosition() {
    return { x: this.mouseX, y: this.mouseY };
  }

  reset() {
    this.keys.clear();
    this.mouseDown = false;
  }
}
