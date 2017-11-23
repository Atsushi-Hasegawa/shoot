
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

class Player {
  constructor(assets) {
    this.hp      = 3;
    this.left    = 37;
    this.up      = 38;
    this.right   = 39;
    this.down    = 40;
    this.player;

    PIXI.loader
    .add(assets.name, assets.json)
    .load(this.onAssetsLoaded.bind(this));
  }

  onAssetsLoaded(loader, res) {
    this.player = new PIXI.spine.Spine(res.alice.spineData);
    this.player.position.x = renderer.width * 0.5;
    this.player.position.y = renderer.height;
    this.player.scale.set(0.25);
    stage.addChild(this.player);
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

  move() {
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
        default:
          break;
      }
    });
  }

  run() {
    this.move();
  }
}

//XXX: 外部入力できるようにする
assets = {
  'name': 'alice',
  'json': '../assets/test_for_spine.json'
};

player = new Player(assets);
player.run();
requestAnimationFrame(animate);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(stage);
}
