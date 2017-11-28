class Enemy extends PixiBase {
  constructor(enemyAssets, bg) {
    super(enemyAssets, bg);
    this.hp    = 3;
    this.speed = 5;
    this.list  = [];
    this.bg    = bg;
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
    this.bBullet = new EnemyBullet(this.enemy.position, this.bg);
    this.bBullet.run();
  }

  initialize(){
    if (this.list[0] != undefined && 
        this.list[0].position.x > this._renderer.width) {
      this.list[0].position.x = 0;
    }
  }

  /**
   * 自動移動する
   */
  move() {
    requestAnimationFrame(this.move);
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].position.x < this._renderer.width + this.enemy.width) {
        this.list[i].position.x += this.speed;
      }
    }
    this.initialize();
  }

  run() {
    this.move();
    this.update();
  }
}

