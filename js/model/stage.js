
class Stage {
  constructor(image) {
    this.image    = image;
    this.width     = 600;
    this.height    = 320;
    this.position  = 0;
    this.stage     = new PIXI.Container();
    this._renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.initialize();
    this.fg1;
    this.fg2;
    this.move = this.move.bind(this);
    this.move();
  }

  initialize() {
    document.body.appendChild(this._renderer.view);
    this.fg1 = new PIXI.Sprite.fromImage(this.image);
    this.fg2 = new PIXI.Sprite.fromImage(this.image);
    this.stage.addChild(this.fg1, this.fg2);
  }

  /**
  * xxxx: 要実装し直しが必要
  */
  move() {
    requestAnimationFrame(this.move);
    this.position += 2;

    this.fg1.x  = -this.position;
    this.fg1.x %= this.width * 4;
    if(this.fg1.x < 0) {
      this.fg1.x += this.width * 4;
    }
    this.fg1.x -= this.width * 2;

    this.fg2.x  = -this.position + this.width * 2;
    this.fg2.x %= this.width * 4;
    if(this.fg2.x < 0) {
      this.fg2.x += this.width * 4;
    }
    this.fg2.x -= this.width * 2;
  }
}

