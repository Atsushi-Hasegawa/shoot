
class Stage {
  constructor(image) {
    this.image    = image;
    this.width     = 640;
    this.height    = 320;
    this.stage     = new PIXI.Container();
    this._renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.initialize();
  }

  initialize() {
    document.body.appendChild(this._renderer.view);
    var bg = new PIXI.Texture.fromImage(this.image);
    var scence = new PIXI.extras.TilingSprite(bg, this.width, this.height);
    this.stage.addChild(scence);
  }
}

