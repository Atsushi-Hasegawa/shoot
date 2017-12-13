
class Stage {
  constructor(image) {
    this.image    = image;
    this.width     = 600;
    this.height    = 320;
    this.position  = 0;
    this.stage     = new PIXI.Container();
    this._renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.initialize();
    this.background;
    this.move = this.move.bind(this);
  }

  initialize() {
    document.body.appendChild(this._renderer.view);
    this.background = new PIXI.Sprite.fromImage(this.image);
    this.stage.addChild(this.background);
  }

  move(params) {
    var posX = params["x"] || null;
    if (posX) {
      var percent = (posX - this._renderer.width * 0.5) / (this._renderer.height * 0.5);
      this.background.x = -40 * percent;
    }
  }
}

