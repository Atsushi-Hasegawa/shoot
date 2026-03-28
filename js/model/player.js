class Player extends PixiBase {
  constructor(spineData, bg) {
    super(spineData, bg);
    this.player  = null;
    this.isAlive = null;
    this.isHit   = null;
    this.init();
    this.onAssetsLoaded(spineData);
  }

  onAssetsLoaded(spineData) {
    this.player = new PIXI.spine.Spine(spineData);
    this.player.position.x = this._renderer.width * 0.5;
    this.player.position.y = this._renderer.height;
    this.player.scale.set(0.15);
    
    // Play idle animation if exists
    if (this.player.state && this.player.state.setAnimation) {
      try {
        this.player.state.setAnimation(0, 'idle', true);
      } catch (e) {
        console.warn("Animation 'idle' not found for player");
      }
    }
    
    this.stage.addChild(this.player);
  }

  init() {
    this.isAlive = true;
    this.isHit  = false;
  }

  getAlive() {
    return this.isAlive;
  }

  getHit() {
    return this.isHit;
  }

  getMovieClip() {
    return this.player;
  }

  getHeight() {
    if (!this.player) return;
    return this.player.height;
  }

  setHit() {
    this.isAlive = false;
  }

  remove() {
    this.stage.removeChild(this.player);
  }

  move(pos) {
    if (!this.isAlive || !this.player) return;
    if (pos.x) this.player.x = pos.x;
    if (pos.y) this.player.y = pos.y;
  }

  hitTest(x, y) {
    if (!this.player) return;
    return Math.abs(this.player.x - x) < this.player.width * 0.25 && Math.abs(this.player.y - y) < this.player.height;
  }

}
