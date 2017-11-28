
class EnemyBullet {
  constructor(pos, bg) {
    this.bg    = bg;
    this.pos   = pos;
    this.bList = [];
    this.shoot = this.shoot.bind(this);
  }

  initialize() {
    var bullet = new PIXI.Graphics();
    bullet.beginFill(0xFFFFFF,0.5).drawCircle(0,0,5);
    bullet.x = this.pos.x;
    bullet.y = this.pos.y - 30;
    this.bg.stage.addChild(bullet);
    this.bList.push(bullet);
  }

  shoot() {
    requestAnimationFrame(this.shoot);
    for(var i = 0; i < this.bList.length; i++) {
      this.bList[i].x += 10;
      if (this.bList[i].x > this.bg._renderer.width) {
        this.bg.stage.removeChild(this.bList[i]);
        this.bList.splice(i, 1);
      }
    }
    if (this.bList.length == 0) this.initialize();
    this.bg._renderer.render(this.bg.stage);
  }

  run() {
    this.initialize();
    this.shoot();
  }
}

