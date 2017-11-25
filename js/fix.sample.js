
var WIDTH    = 640;
var HEIGHT   = 480;
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage   = new PIXI.Container();
var bg      = new PIXI.Texture.fromImage('../img/bg.jpg');

scence = new PIXI.extras.TilingSprite(bg, WIDTH, HEIGHT);
stage.addChild(scence);
stage.interactive = true;


class PixiBase {
  constructor(assets) {
    this.loader = new PIXI.loaders.Loader();
    this.loader
    .add(assets.name, assets.json);
    this.stage = new PIXI.Container();
  }

  animate(method) {
    renderer.render(stage);
    requestAnimationFrame(method);
  }
}

class Enemy extends PixiBase {
  constructor(enemyAssets){
    super(enemyAssets);
    this.hp = 3;
    this.list = [];
    this.loader
    .load(this.onAssetsLoaded.bind(this));
    this.move = this.move.bind(this);
  }

  onAssetsLoaded(loader, res) {
    this.enemy = new PIXI.spine.Spine(res.enemy.spineData);
    this.enemy.position.x = 0;
    this.enemy.position.y = renderer.height;
    stage.addChild(this.enemy);
    this.list.push(this.enemy);
  }

  /**
   * 自動移動する
   */
  move() {
    for (var i = 0; i < this.list.length; i++) {
      this.list[i].position.x += 10;
      if (this.list[i].position.x > renderer.width) {
        stage.removeChild(this.list[i]);
        this.list.splice(i, 1);
      }
    }
    this.animate(this.move);
  }

  /**
   * 描画
   */
  animate(method) {
    renderer.render(stage);
    requestAnimationFrame(method);
  }

  run() {
    this.move();
  }
}

class Player extends PixiBase {
  constructor(assets) {
    super(assets);
    this.hp      = 3;
    this.space   = 32;
    this.left    = 37;
    this.up      = 38;
    this.right   = 39;
    this.down    = 40;
    this.player;
    this.loader
    .load(this.onAssetsLoaded.bind(this));
  }

  onAssetsLoaded(loader, res) {
    this.player = new PIXI.spine.Spine(res.alice.spineData);
    this.player.position.x = renderer.width * 0.5;
    this.player.position.y = renderer.height;
    this.player.scale.set(0.25);
    stage.addChild(this.player);
    this.list = [this.player];
    this.pBullet = new PlayerBullet(this.player.position);
  }

  moveXAxis(posX) {
    if (this.player.position.x >= renderer.width - 40) { 
      return (posX < 0) ? posX : 0;
    }
    if (this.player.position.x <= 40) {
      return (posX < 0) ? 0 : posX;
    }
    return posX;
  }

  moveYAxis(posY) {
    if (this.player.position.y > renderer.height) { 
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
  }
}

class Input {
}

class PlayerBullet {
  constructor(pos) {
    this.blist = [];
    this.pos = pos;
    this.shoot = this.shoot.bind(this);
  }

  initialize() {
    var bullet = new PIXI.Graphics();
    bullet.beginFill(0xFFFFFF,0.5).drawCircle(0,0,5);
    bullet.x = this.pos.x;
    bullet.y = this.pos.y - 30;
    stage.addChild(bullet);
    this.blist.push(bullet);
  }

  shoot() {
    requestAnimationFrame(this.shoot);
    for(var i = 0; i < this.blist.length; i++) {
      this.blist[i].x -= 10;
      if (this.blist[i].x < 0) {
        stage.removeChild(this.blist[i]);
        this.blist.splice(i, 1);
      }
    }
    animate(this.shoot);
  }

  animate(method) {
    requestAnimationFrame(method);
    renderer.render(stage);
  }

  run() {
    this.initialize();
    this.shoot();
  }
}
//XXX: 外部入力できるようにする
assets = {
  'name': 'alice',
  'json': '../assets/test_for_spine.json'
};
enemyAssets = {
  'name': 'enemy',
  'json': '../assets/test_for_spin.json'
};
player = new Player(assets);
player.run();
pBullet = new PlayerBullet(player);
pBullet.run();
enemy = new Enemy(enemyAssets);
enemy.run();
requestAnimationFrame(animate);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(stage);
}
