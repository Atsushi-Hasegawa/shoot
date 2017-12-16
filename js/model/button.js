class Button {
  constructor(button, bg, id) {
    this.bg  = bg;
    this.button = button;
    this.id = id;
  }

  init() {
    var image = new PIXI.Sprite.fromImage(this.button);
    image.x = 32 * this.id;
    image.y = this.bg._renderer.height - 32;
    image.scale.set(0.5);
    image.buttonMode  = true;
    image.interactive = true;
    this.bg.stage.addChild(image);
  }

  setClick() {
    this.isHit = true;
  }

  get() {
    return this.number;
  }
}
