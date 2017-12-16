class Stage {
  constructor(image) {
    this.image    = image;
    this.width     = 600;
    this.height    = 320;
    this.alpha     = 10;
    this.position  = 0;
    this.stage     = new PIXI.Container();
    this._renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.initialize();
    this.background;
    this.foreground;
    this.move = this.move.bind(this);
  }

  initialize() {
    document.body.appendChild(this._renderer.view);
    this.background = new PIXI.Sprite.fromImage(this.image);
    this.foreground = new PIXI.Sprite.fromImage(this.image);
    this.stage.addChild(this.foreground, this.background);
  }

  move(params) {
    var posX = params["x"] || null;
    if (posX) {
      var percent = (posX - this.width * 0.5) / (this.height * 0.5);
      this.foreground.x = -this.alpha * percent;
      this.foreground.x %= this.width * 4;
      if (this.foreground.x < 0) {
        this.foreground.x += this.width * 4;
      }
       this.foreground.x -= this.width * 2;

      this.background.x = this.width * 2 - this.alpha * percent;
      this.background.x %= this.width * 4;
      if (this.background.x < 0) {
        this.background.x += this.width * 4;
      }
      this.background.x -= this.width * 2;
    }
  }
}

