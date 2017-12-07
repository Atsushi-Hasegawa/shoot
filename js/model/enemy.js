class Enemy extends PixiBase {
  constructor(enemyAssets, bg) {
    super(enemyAssets, bg);
    this.hp     = 1;
    this.speed  = 2;
    this.bspeed = 5;
    this.list   = [];
    this.bg     = bg;
    this.enemy;
    this.ebullet;
    this.loader
    .load(this.onAssetsLoaded.bind(this));
    this.move = this.move.bind(this);
  }

  onAssetsLoaded(loader, res) {
    this.enemy = new PIXI.spine.Spine(res.enemy.spineData);
    this.enemy.position.x = 0;
    this.enemy.position.y = this._renderer.height;
    this.enemy.scale.set(0.75);
    this.stage.addChild(this.enemy);
    this.list.push(this.enemy);
    //this.ebullet = new Bullet(this.enemy.position, this.bg, this.bspeed);
    //this.ebullet.shoot();
  }

  initialize(){
    if (this.list[0] != undefined && 
        this.list[0].position.x > this._renderer.width) {
      this.list[0].position.x = 0;
    }
  }

  move() {
    requestAnimationFrame(this.move);
    for (let list of this.list) {
      if (list.position.x < this._renderer.width + this.enemy.width) {
        list.position.x += this.speed;
      }
    }
    this.initialize();
  }

  getPlayer() {
    return this.list;
  }

  run() {
    this.move();
    this.update();
  }
}
