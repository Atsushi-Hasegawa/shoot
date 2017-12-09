class Enemy extends PixiBase {
  constructor(assets, bg) {
    super(assets, bg);
    this.enemy   = undefined;
    this.isAlive = null;
    this.isHit   = null;
    this.move = this.move.bind(this);
    this.loader
    .load(this.onAssetsLoaded.bind(this));
    this.init();
  }

  onAssetsLoaded(loader, res) {
    this.enemy = new PIXI.spine.Spine(res.enemy.spineData);
    this.enemy.position.x = 0;
    this.enemy.position.y = this._renderer.height;
    this.enemy.scale.set(0.75);
    this.stage.addChild(this.enemy);
  }

  init() {
    this.isAlive = true;
    this.isHit   = false;
  }

  getAlive() {
    return this.isAlive;
  }

  getHit() {
    return this.isHit;
  }
  hit() {
    this.isAlive = false;
  }
  remove() {
    this.stage.removeChild(this.enemy);
  }
  move(pos) {
    if (!this.isAlive || !this.enemy) return;
    if (pos.x) this.enemy.x = pos.x;
  }
}
