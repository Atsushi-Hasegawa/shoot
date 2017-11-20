$(function() {

var position = 0;
var WIDTH    = 640;
var HEIGHT   = 480;
var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage   = new PIXI.Container();
//var bg      = new PIXI.Sprite.fromImage('https://voltack.github.io/mats/images/2015/12/bg01.jpg');
//var bg      = new PIXI.Sprite.fromImage('../img/bg.jpg');
var bg      = new PIXI.Texture.fromImage('../img/bg.jpg');
var snows      = [];
var bulletList = [];
var enemyBulletList = [];
var enemyList  = [];
var power_gague = 3;
var playerList = [];
var SNOW_LIMIT = 600;
var HALF_WIDTH = WIDTH * 0.5;
//input keyCode
var gameScene = new PIXI.Container();
var counter     = 0;
var SPACE       = 32;
var LEFT_ARROW  = 37;
var UP_ARROW    = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW  = 40;

scence = new PIXI.extras.TilingSprite(bg, WIDTH, HEIGHT);
stage.addChild(scence);

// 銃のモーション
function gun_shot_enemy_animate() {
  if (enemyList.length != 0) {
    requestAnimationFrame(gun_shot_enemy_animate);
    // 発射弾の移動処理
    for (var i = 0; i < enemyBulletList.length; i++) {
      enemyBulletList[i].x += 2;
      // 画面端まで移動したら
      if (enemyBulletList[i].x > WIDTH) {
        stage.removeChild(enemyBulletList[i]); // 画面から削除
        enemyBulletList.splice(i, 1); // 配列から削除
      }
    }
    renderer.render(stage);
  }
}

// 銃のモーション
function gun_shot_animate() {
  if (playerList.length != 0) {
    requestAnimationFrame(gun_shot_animate);
    // 発射弾の移動処理
    for (var i = 0; i < bulletList.length; i++) {
      bulletList[i].x -= 1;
      // 画面端まで移動したら
      if (bulletList[i].x < 0) {
        stage.removeChild(bulletList[i]); // 画面から削除
        bulletList.splice(i, 1); // 配列から削除
      }
    }
    renderer.render(stage);
  }
}

//load spine data
PIXI.loader
.add('alice', '../assets/test_for_spine.json')
.add('enemy', '../assets/test_alice.json')
.load(onAssetsLoaded);

stage.interactive = true;

function onAssetsLoaded(loader, res) {
  // create an alice
  var alice = new PIXI.spine.Spine(res.alice.spineData);
  var enemy = new PIXI.spine.Spine(res.enemy.spineData);
  var move_x = 0;
  var move_y = 0;

  // set the position
  alice.position.x = renderer.width * 0.5;
  alice.position.y = renderer.height;

  enemy.position.x = 0;
  enemy.position.y = renderer.height;

  alice.scale.set(0.25);
  enemy.scale.set(0.25);

  //set up mixes
  alice.stateData.setMix('walk', 'stand_by', 0.2);
  alice.stateData.setMix('stand_by', 'walk', 0.4);

  // play animation
  alice.state.setAnimation(0, 'walk', true);

  stage.addChild(alice);
  stage.addChild(enemy);
  enemyList.push(enemy);
  playerList.push(alice);

  function moveXposition() {
    if (move_x < 0 && alice.position.x < enemy.position.x) {
      return 0;
    }
    if (alice.position.x >= renderer.width - 40) { 
      return (move_x < 0) ? move_x : 0;
    }
    if (alice.position.x <= 40) {
      return (move_x < 0) ? 0 : move_x;
    }
    return move_x;
  }

  function moveYposition() {
    if (alice.position.y > renderer.height) { 
      return (move_y < 0) ? move_y : 0;
    }
    if (alice.position.y <= 40) {
      return (move_y < 0) ? 0 : move_y;
    }
    return move_y;
  }

  $(window).keydown(function(event) {
      if (playerList.length != 0) {
      switch(event.keyCode) {
      case LEFT_ARROW:
      move_x = -10;
      alice.position.x += moveXposition();
      scence.tilePosition.x += moveXposition();
      break;
      case UP_ARROW:
      move_y = -10;
      alice.position.y += moveYposition();
      break;
      case RIGHT_ARROW:
      move_x = 10;
      alice.position.x += moveXposition();
      scence.tilePosition.x += moveXposition();
      break;
      case DOWN_ARROW:
      move_y = 10;
      alice.position.y += moveYposition();
      break;
      case SPACE:
      createBullet();
      gun_shot_animate();
      gunHit();
      break;
      }
      }
  });

  function move() {
    if (alice.position.x > 0 && alice.position.x < renderer.width) { 
      scence.tilePosition.x += move_x
    }
  }

  function appearEnemy() {
    if (enemyList.length == 0 || enemy.position.x > WIDTH) {
      enemy.position.x = -40;// xxx: 適当に画面外から出現させるようにする
      enemy.position.y = renderer.height;
      power_gague = 3;
      stage.addChild(enemy);
      enemyList.push(enemy);
    }
  }

  move_enemy_animate();
  createEnemyBullet();
  gun_shot_enemy_animate();
  enemyGunShot();
  characterHit();

  //直進のみで動く(xxx: 其々の敵キャラによって行動を変えるクラスを結成すべき)
  function move_enemy_animate() {
    if (enemyList.length != 0) {
      // 敵の移動処理
      for (var i = 0; i < enemyList.length; i++) {
        if (enemyList[i].x < HALF_WIDTH) {
          enemyList[i].x += 1;
        }
        if (enemyList[i].x > WIDTH) {
          stage.removeChild(enemyList[i]); // 画面から削除
          enemyList.splice(i, 1); // 配列から削除
        }
      }
    } else {
      appearEnemy();
      createEnemyBullet();
      gun_shot_enemy_animate();
    }
    requestAnimationFrame(move_enemy_animate);
    renderer.render(stage);
  }

  function characterHit() {
    requestAnimationFrame(characterHit);
    for (var i = 0; i < playerList.length; i++) {
      for (var j = 0; j < enemyList.length; j++) {
        if (playerList[i].x == enemyList[j].x &&
            Math.abs(playerList[i].y - enemyList[j].y) < enemy.height) {
          stage.removeChild(playerList[i]);
          playerList.splice(i,1);
          break;
        }
      }
    }
    renderer.render(stage);
  }

  function enemyGunShot() {
    if (playerList.length == 0) {
      gameOver()
    }
    if (enemyList.length == 0) {
      initialize(enemyBulletList);
    } else {
      for (var i = 0; i < playerList.length; i++) {
        for (var j = 0; j < enemyBulletList.length; j++) {
          var enemyBullet = enemyBulletList[j];
          var player  = playerList[i];
          if (enemyBullet.x > player.x && enemyBullet.y - player.y <= 0) {
            stage.removeChild(enemyBullet);
            enemyBulletList.splice(i,1);

            stage.removeChild(player);
            playerList.splice(j,1);
            break;
          }
        }
      }
    }
    renderer.render(stage);
    requestAnimationFrame(enemyGunShot);
  }

  function gunHit() {
    requestAnimationFrame(gunHit);
    if (playerList.length == 0) {
      initialize(bulletList);
    } else {
    for (var i = 0; i < enemyList.length; i++) {
      for (var j = 0; j < bulletList.length; j++) {
        var bullet = bulletList[j];
        var enemy  = enemyList[i];

        if (bullet.x < enemy.x && Math.abs(bullet.y - enemy.y) < enemy.height) {
          stage.removeChild(bullet);
          bulletList.splice(i,1);
          /* 撃墜する条件
           * HPが0以下にする
           * 銃撃を受けるとHPが1減る
           */
          if (power_gague <= 0) {
            stage.removeChild(enemy);
            enemyList.splice(j,1);
          } else {
            power_gague--;
          }
          break;
        }
      }
    }
    }
    renderer.render(stage);
  }

  /**
   * 弾幕を初期化する
   * @param array bullet
   *
   */
  function initialize(bullet) {
    for(var i = 0; i < bullet.length; i++) {
      stage.removeChild(bullet[i]);
      bullet.splice(i,1);
    }
  }

  function createBullet() {
    var bullet = new PIXI.Graphics();
    bullet.beginFill(0xFFFFFF,0.5).drawCircle(0,0,5);
    bullet.x = alice.position.x;
    bullet.y = alice.position.y - 30;
    stage.addChild(bullet);
    bulletList.push(bullet);
  }

  function createEnemyBullet() {
    var enemyBullet = new PIXI.Graphics();
    enemyBullet.beginFill(0xFFFFFF,0.5).drawCircle(0,0,5);
    enemyBullet.x = enemy.position.x;
    enemyBullet.y = enemy.position.y - 30;
    stage.addChild(enemyBullet);
    enemyBulletList.push(enemyBullet);
  }

  function gameOver() {
    var gameOverScene = new PIXI.Container();
    stage.addChild(gameOverScene)
    message = new PIXI.Text(
         "Game Over",
         {font: "64px Futura", fill: "black"}
    )
    //画面中央に表示するため、以下の係数をかけている
    message.x = renderer.width * 0.25
    message.y = renderer.height * 0.25
    gameOverScene.addChild(message)
    initialize(enemyList)
  }
}
  requestAnimationFrame(animate);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(stage);
  }
});
