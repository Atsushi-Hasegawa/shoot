class PixiBase {
  constructor(assets, bg) {
    this.stage     = bg.stage;
    this._renderer = bg._renderer;
    this.loader    = new PIXI.loaders.Loader();
    this.loader
    .add(assets.name, assets.json);
    this.stage.interactive = true;
  }

  update() {
    this._renderer.render(this.stage);
  }
}
