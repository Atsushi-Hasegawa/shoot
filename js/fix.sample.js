
/***
 * must:
 * できる限り定数管理はconstructorでするもしくは外部から渡す
 */
class BackGround {
  constructor(image) {
    this.image    = image;
    this.width     = 640;
    this.height    = 320;
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
    this.ebullet = new Bullet(this.enemy.position, this.bg, this.bspeed);
    this.ebullet.shoot();
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

  getPlayer() {
    return this.list;
  }

  run() {
    this.move();
    this.update();
  }
}

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
    this.bg      = bg;
    this.list    = [];
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
    this.list.push(this.player);
    this.pbullet = new Bullet(this.player.position, this.bg, this.bspeed);
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

  operate() {
    $(window).keydown(function(event) {
      var x = 0;
      var y = 0;
      switch(event.keyCode) {
        case this.player.left:
          x = -10
          break;
        case this.player.right:
          x = 10;
          break;
        case this.player.up:
          y = -10;
          break;
        case this.player.down:
          y = 10;
          break;
        case this.player.space:
          this.player.pbullet.run();
          break;
        default:
          break;
      }
      this.player.addMove(x, y);
    });
  }

  getPlayer() {
    return this.list;
  }

  run() {
    this.operate();
    this.update();
  }
}

class Bullet {
  constructor(pos, bg, speed) {
    this.bg    = bg;
    this.pos   = pos;
    this.bList = [];
    this.speed = speed;
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
      this.bList[i].x += this.speed;
      if (this.bList[i].x > this.bg._renderer.width) {
        this.bg.stage.removeChild(this.bList[i]);
        this.bList.splice(i, 1);
      }
    }
    if (this.bList.length == 0) this.initialize();
  }

  run() {
    this.initialize();
    this.shoot();
  }
}

class Battle {
  constructor(player, enemy, hp, bg) {
    this.player = player;
    this.enemy  = enemy;
    this.bg     = bg;
    this.hp     = hp;
    this.attack = this.attack.bind(this);
  }

  attack() {
    var id = requestAnimationFrame(this.attack);
    for(var i = 0; i < this.player.length; i++) {
      for(var j = 0; j < this.enemy.length; j++) {
        if (this.isHit(this.player[i],this.enemy[j])) {
          this.addDamage();
          if (this.hp < 0) {
            this.bg.stage.removeChild(this.player[i]);
            this.player.splice(i, 1);
            cancelAnimationFrame(id);
          }
        }
      }
    }
  }

  isHit(player, enemy) {
    if (player.x == enemy.x && Math.abs(player.y - enemy.y) < enemy.height) {
      return true;
    }
    return false;
  }

  addDamage() {
    this.hp--;
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
//アタックする(体当たり)
pList = player.getPlayer();
eList = enemy.getPlayer();
battle = new Battle(pList, eList, player.hp, bg)
battle.attack();
