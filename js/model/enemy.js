class Enemy extends PixiBase {
  constructor(spineData, bg, id) {
    super(spineData, bg);
    this.id      = id;
    this.speed   = 2;
    this.enemy   = null;
    this.isAlive = null;
    this.isHit   = null;
    this.degree  = 0;
    this.counter = 0;
    this.onAssetsLoaded(spineData);
  }

  onAssetsLoaded(spineData) {
    this.enemy = new PIXI.spine.Spine(spineData);
    this.enemy.position.x = 10;
    this.enemy.position.y = this._renderer.height * 0.8; // Position adjusted upward
    this.enemy.scale.set(0.2);
    
    // Set to initial pose
    this.enemy.skeleton.setToSetupPose();
    this.enemy.updateWorldTransform();
    
    // Play idle animation
    if (this.enemy.state && this.enemy.state.setAnimation) {
      try {
        this.enemy.state.setAnimation(0, 'idle', true);
      } catch (e) {
        console.warn("Animation 'idle' not found for enemy");
      }
    }
    
    this.stage.addChild(this.enemy);
  }

  init() {
    this.isAlive = true;
    this.isHit   = false;
    this.isShot  = false;
  }

  getId() {
    return this.id;
  }
  getPosition() {
    if (!this.enemy) return;
    return this.enemy;
  }
  getAlive() {
    return this.isAlive;
  }
  getHit() {
    return this.isHit;
  }
  getMovieClip() {
    if (!this.enemy) return;
    return this.enemy;
  }

  hit() {
    this.isAlive = false;
  }

  remove() {
    this.isAlive = false;
    if (this.enemy) {
      this.stage.removeChild(this.enemy);
    }
  }

  hitTest(x, y) {
    if (!this.enemy || !this.isAlive) return;
    return Math.abs(this.enemy.x - x) <= this.enemy.width * 0.25 && Math.abs(this.enemy.y - y) < this.enemy.height;
  }

  update() {
    if (!this.enemy || !this.isAlive) return;
    var pos = this.enemy.x + this.speed;
    var y = Math.sin(this.degree) * this.speed;
    this.counter++;
    if (this.counter % 60 === 0) {
      this.degree -= this.speed;
    }
    if (pos < this._renderer.width + this.enemy.width) {
      this.enemy.x = pos;
      this.enemy.y += y;
    } else {
      this.remove();
    }
  }

  run() {
    this.init();
  }
}
