
class PlayerBullet {
  constructor(pos, bg) {
    this.blist = [];
    this.pos   = pos;
    this.spped = 5;
    this.shoot = this.shoot.bind(this);
    this.bg    = bg;
  }

  initialize() {
    var bullet = new PIXI.Graphics();
    bullet.beginFill(0xFFFFFF,0.5).drawCircle(0,0,5);
    bullet.x = this.pos.x;
    bullet.y = this.pos.y - 30;
    this.bg.stage.addChild(bullet);
    this.blist.push(bullet);
  }

  shoot() {
    requestAnimationFrame(this.shoot);
    for(var i = 0; i < this.blist.length; i++) {
      this.blist[i].x -= this.speed;
      if (this.blist[i].x < 0) {
        this.bg.stage.removeChild(this.blist[i]);
        this.blist.splice(i, 1);
      }
    }
  }

  run() {
    this.initialize();
    this.shoot();
  }
}

