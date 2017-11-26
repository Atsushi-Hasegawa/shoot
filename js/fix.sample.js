
class BackGround {
  constructor(image) {
    this.image    = image;
    this.width     = 640;
    this.height    = 480;
    this.stage     = new PIXI.Container();
    this._renderer = PIXI.autoDetectRenderer(this.width, this.height);
    this.initialize();
  }

  initialize() {
    document.body.appendChild(this._renderer.view);
    var bg = new PIXI.Texture.fromImage(this.image);
    var scence = new PIXI.extras.TilingSprite(bg, this.width, this.height);
    this.stage.addChild(scence);
  }
}

class PixiBase {
  constructor(assets, bg) {
    this.update    = this.update.bind(this);
    this.stage     = bg.stage;
    this._renderer = bg._renderer;
    this.loader    = new PIXI.loaders.Loader();
    this.loader
    .add(assets.name, assets.json);
    this.update();
  }

  update() {
    requestAnimationFrame(this.update);
    this._renderer.render(this.stage);
  }
}

class Enemy extends PixiBase {
  constructor(enemyAssets, bg) {
    super(enemyAssets, bg);
    this.hp    = 3;
    this.speed = 5;
    this.list  = [];
    this.loader
    .load(this.onAssetsLoaded.bind(this));
    this.move = this.move.bind(this);
  }

  onAssetsLoaded(loader, res) {
    this.enemy = new PIXI.spine.Spine(res.enemy.spineData);
    this.enemy.position.x = 0;
    this.enemy.position.y = this._renderer.height;
    this.stage.addChild(this.enemy);
    this.list.push(this.enemy);
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
    this.update();
  }

  run() {
    this.move();
  }
}

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

class PlayerBullet {
  constructor(pos, bg) {
    this.blist = [];
    this.pos = pos;
    this.shoot = this.shoot.bind(this);
    this. bg = bg;
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
      this.blist[i].x -= 5;
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

class EnemyBullet {
  constructor(pos, bg) {
    this.bg    = bg;
    this.pos   = pos;
    this.bList = [];
    this.initialize(); 
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
    for(var i = 0; i < this.blist.length; i++) {
      this.blist[i].x -= 5;
      if (this.blist[i].x < 0) {
        this.bg.stage.removeChild(this.blist[i]);
        this.blist.splice(i, 1);
      }
    }
  }
}

class Battle {
  constructor(player, enemy, bg) {
    this.player = player;
    this.enemy  = enemy;
    this.bg     = this.bg;
    this.hitBodyAttack.bind(this);
  }

  hitBodyAttack() {
    requestAnimationFrame(this.histBodyAttack);
    for(var i = 0; i < this.player.length; i++) {
      for(var j = 0; j < this.enemy.length; j++) {
        if (this.player[i].x == this.enemy[j].x) {
          this.bg.stage.removeChild(this.player[i]);
          this.player.splice(i, 1);
        }
      }
    }
  }
}
//XXX: 外部入力できるようにする
assets = {
  'name': 'alice',
  'json': '../assets/test_for_spine.json',
};

enemyAssets = {
  'name': 'enemy',
  'json': '../assets/test_for_spin.json',
};

image = '../img/bg.jpg';
//背景オブジェクトを作成
bg = new BackGround(image);
//キャラクターの作成(敵、味方)
player = new Player(assets, bg);
player.run();
enemy = new Enemy(enemyAssets, bg);
enemy.run();
//銃弾インスタンスを作成(敵、味方)
//pbList = new PlayerBullet(player,bg);
//bbList = new EnemyBullet(enemy,bg);
//ebList = new EnemyBullet(player,bg);
//battle = new Battle(pbList, bbList, bg);
//console.log(battle);
