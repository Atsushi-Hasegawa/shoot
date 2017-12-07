
/***
 * must:
 * できる限り定数管理はconstructorでするもしくは外部から渡す
 */
class BackGround {
  constructor(image) {
    this.image    = image;
    this.width     = 640;
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
    //this.ebullet = new Bullet(this.enemy.position, this.bg, this.bspeed);
    //this.ebullet.shoot();
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
    this.pbList  = [];
    this.player;
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
    this.pbullet = new Bullet(this.player.position, this.bg, this.bspeed);
    this.pbList.push(this.pbullet);
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
          this.player.shoot();
          break;
        default:
          break;
      }
      this.player.addMove(x, y);
    });
  }

  shoot() {
    this.pbullet = new Bullet(this.player.position, this.bg, this.bspeed);
    this.pbullet.run();
  }

  getPlayer() {
    return this.list;
  }

  getBullet() {
    return this.pbList;
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
    this.initialize();
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
    for(let bList of this.bList) {
      bList.x += this.speed;
      if (bList.x > this.bg._renderer.width) {
        this.bg.stage.removeChild(bList);
        bList.splice;
        break;
      }
    }
    if (this.bList.length == 0) this.initialize();
  }

  getList() {
    return this.bList;
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
    for(let player of this.player) {
      for(let enemy of this.enemy) {
        if (this.isHit(player,enemy)) {
          this.addDamage();
          if (this.hp < 0) {
            this.bg.stage.removeChild(player);
            player.splice;
            break;
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

//xxx: ステージごとに切り替えるように改修
image = '../img/stage/1.jpg';
//背景オブジェクトを作成
bg = new BackGround(image);
//キャラクターの作成(敵、味方)
player = new Player(assets, bg);
player.run();
enemy = new Enemy(enemyAssets, bg);
enemy.run();
//アタックする(体当たり)
pList  = player.getPlayer();
eList  = enemy.getPlayer();
battle = new Battle(pList, eList, player.hp, bg);
battle.attack();
