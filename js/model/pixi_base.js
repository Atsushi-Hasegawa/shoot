class PixiBase {
  constructor(spineData, bg) {
    this.stage     = bg.stage;
    this._renderer = bg._renderer;
    this.spineData = spineData;
    this.stage.interactive = true;
  }

  update() {
    this._renderer.render(this.stage);
  }
}
