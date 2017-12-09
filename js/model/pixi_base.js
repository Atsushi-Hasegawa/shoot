class PixiBase {
  constructor(assets, bg) {
    this.update    = this.update.bind(this);
    this.stage     = bg.stage;
    this._renderer = bg._renderer;
    this.loader    = new PIXI.loaders.Loader();
    this.loader
    .add(assets.name, assets.json);
    this.stage.interactive = true;
    this.update();
  }

  update() {
    requestAnimationFrame(this.update);
    this._renderer.render(this.stage);
  }
}
