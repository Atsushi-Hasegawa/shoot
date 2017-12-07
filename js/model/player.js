class Player extends PixiBase {
  constructor(assets, bg) {
    super(assets, bg);
    this.hp      = 1;
    this.bspeed  = -5;
    this.space   = 32;
    this.left    = 37;
    this.up      = 38;
    this.right   = 39;
    this.down    = 40;
    this.code    = 0;
    this.bg      = bg;
    this.list    = [];
    this.pbList  = [];
    this.player  = undefined;
    this.shoot   = this.shoot.bind(this);
    this.loader
    .load(this.onAssetsLoaded.bind(this));
  }

  onAssetsLoaded(loader, res) {
    this.player = new PIXI.spine.Spine(res.alice.spineData);
    this.player.position.x = this._renderer.width * 0.5;
    this.player.position.y = this._renderer.height;
    this.player.scale.set(0.25);
    this.stage.addChild(this.player);
    this.list.push(this.player);
  }

  moveX(x) {
    if (this.player.position.x >= this._renderer.width - 40) {
      return (x < 0) ? x : 0;
    }
    if (this.player.position.x <= this.player.width) {
      return (x < 0) ? 0 : x;
    }
    return x;
  }

  moveY(y) {
    if (this.player.position.y > this._renderer.height) { 
      y = (y < 0) ? y : 0;
    }
    if (this.player.position.y <= this.player.height) {
      y = (y < 0) ? 0 : y;
    }
    return y;
  }

  addMove(x, y) {
    this.player.position.x += this.moveX(x);
    this.player.position.y += this.moveY(y);
  }

  shoot() {
    this.pbullet = new Bullet(this.player.position, this.bg, this.bspeed);
    this.pbullet.run();
  }

  getPlayer() {
    return this.list;
  }

  onkeyDown(e) {
    var x = 0, y = 0;
    switch(e.keyCode) {
      case this.left:
        x = -10;
        break;
      case this.right:
        x = 10;
        break;
      case this.down:
        y = 10;
        break;
      case this.up:
        y = -10;
        break;
      case this.space:
        this.shoot();
        break;
      default:
        this.code = e.keyCode;
        break;
    }
    //十字のみ移動実行
    if (x != 0 || y != 0) {
      this.addMove(x,y);
    }
  }

  run() {
    $(window).on("keydown", this.onkeyDown.bind(this));
    this.update();
  }
}
