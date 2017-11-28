
class Player extends PixiBase {
  constructor(assets, bg) {
    super(assets, bg);
    this.hp      = 3;
    this.space   = 32;
    this.left    = 37;
    this.up      = 38;
    this.right   = 39;
    this.down    = 40;
    this.bg      = bg;
    this.player;
    this.loader
    .load(this.onAssetsLoaded.bind(this));
  }

  onAssetsLoaded(loader, res) {
    this.player = new PIXI.spine.Spine(res.alice.spineData);
    this.player.position.x = this._renderer.width * 0.5;
    this.player.position.y = this._renderer.height;
    this.player.scale.set(0.25);
    this.stage.addChild(this.player);
    this.list = [this.player];
    this.pBullet = new PlayerBullet(this.player.position, this.bg);
  }

  moveXAxis(posX) {
    if (this.player.position.x >= this._renderer.width - 40) { 
      return (posX < 0) ? posX : 0;
    }
    if (this.player.position.x <= 40) {
      return (posX < 0) ? 0 : posX;
    }
    return posX;
  }

  moveYAxis(posY) {
    if (this.player.position.y > this._renderer.height) { 
      return (posY < 0) ? posY : 0;
    }
    if (this.player.position.y <= 40) {
      return (posY < 0) ? 0 : posY;
    }
    return posY;
  }

  operate() {
    $(window).keydown(function(event) {
      switch(event.keyCode) {
        case this.player.left:
          this.player.player.position.x += this.player.moveXAxis(-10);
          break;
        case this.player.right:
          this.player.player.position.x += this.player.moveXAxis(10);
          break;
        case this.player.up:
          this.player.player.position.y += this.player.moveYAxis(-10);
          break;
        case this.player.down:
          this.player.player.position.y += this.player.moveYAxis(10);
          break;
        case this.player.space:
          this.player.pBullet.run();
          break;
        default:
          break;
      }
    });
  }

  run() {
    this.operate();
    this.update();
  }
}

