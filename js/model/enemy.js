class Enemy extends PixiBase {
  constructor(assets, bg, id) {
    super(assets, bg);
    this.id      = id;
    this.speed   = 2;
    this.enemy   = null;
    this.isAlive = null;
    this.isHit   = null;
    this.degree  = 0;
    this.counter = 0;
    this.move = this.move.bind(this, 1);
    this.loader
    .load(this.onAssetsLoaded.bind(this));
  }

  onAssetsLoaded(loader, res) {
    this.enemy = new PIXI.spine.Spine(res.enemy.spineData);
    this.enemy.position.x = 10;
    this.enemy.position.y = this._renderer.height;
    this.enemy.scale.set(0.2);
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
    this.stage.removeChild(this.enemy);
  }

  hitTest(x, y) {
    if (!this.enemy) return;
    return Math.abs(this.enemy.x - x) <= this.enemy.width * 0.25 && Math.abs(this.enemy.y - y) < this.enemy.height;
  }

  move(type) {
    requestAnimationFrame(this.move);
    if (!this.enemy) return;
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
    this.move(1);
  }
}
