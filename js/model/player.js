class Player extends PixiBase {
  constructor(assets, bg) {
    super(assets, bg);
    this.player  = undefined;
    this.isAlive = null;
    this.isHit   = null;
    this.loader
    .load(this.onAssetsLoaded.bind(this));
    this.init();
  }

  onAssetsLoaded(loader, res) {
    this.player = new PIXI.spine.Spine(res.alice.spineData);
    this.player.position.x = this._renderer.width * 0.5;
    this.player.position.y = this._renderer.height;
    this.player.scale.set(0.25);
    this.stage.addChild(this.player);
  }

  init() {
    this.isAlive = true;
    this.isHit  = false;
  }

  setFire() {
    if (!this.isAlive) return;
  }

  getAlive() {
    return this.isAlive;
  }

  getHit() {
    return this.isHit;
  }

  remove() {
    this.stage.removeChild(this.player);
  }

  hit() {
    this.isAlive = false;
  }

  move(pos) {
    if (!this.isAlive) return;
    if (pos.x) this.player.x = pos.x;
    if (pos.y) this.player.y = pos.y;
  }
}
