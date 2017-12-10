class Game {
  constructor(assets) {
    this.bg        = null;
    this.player    = null;
    this.enemy     = null;
    this._enemies  = [];
    this._shots    = [];
    this.enemyCount= null;
    this.shotCount = null;
    this.tmp       = null;
    this.image     = assets.image;
    this.assets    = assets;
    this.speed     = 1;
    this.code      = 0;
    this.key = {
      isLEFT:  null,
      isRIGHT: null,
      isUP:    null,
      isDOWN:  null,
      isFIRE:  null
    };
    this.frameCount    = null;
    this.ID_KEY_FIRE   = 32;
    this.ID_KEY_LEFT   = 37;
    this.ID_KEY_UP     = 38;
    this.ID_KEY_RIGHT  = 39;
    this.ID_KEY_DOWN   = 40;
    this.SHOT_DURATION = 4;
    this.onEnterFrame  = this.onEnterFrame.bind(this);
  }

  init() {
    this.bg      = new Stage(this.image);
    this.player  = new Player(this.assets.player, this.bg);
    this.playerX = this.bg._renderer.width * 0.5;
    this.playerY = this.bg._renderer.height;
    this.enemyX  = 0;
    this.shotCount  = 0;
    this.enemyCount = 0;
    this.frameCount = 0;
    for(var i = 0; i < 2; i++) {
      this.addEnemy();
    }
    for(var i in this.key) {
      this.key[i] = false;
    }
  }

  start() {
    this.onEnterFrame();
    $(window).on("keydown", this.onkeyDown.bind(this));
  }

  onEnterFrame() {
    requestAnimationFrame(this.onEnterFrame);
    if (this.tmp != this.code) {
      this.resetKey(this.tmp);
      this.tmp = this.code;
    }
    if (this.key.isFIRE) {
      this.setBullet();
      this.frameCount++;
      this.resetKey(this.code);
    }
    if (this.key.isLEFT) this.moveLeft();
    if (this.key.isRIGHT) this.moveRight();
    if (this.key.isUP) this.moveUp();
    if (this.key.isDOWN) this.moveDown();
    // 敵のアタリ判定
    for (let shot of this._shots) {
      if (!shot || shot.isHit || !shot.target) continue;
      for (let enemy of this._enemies) {
        if (!enemy || enemy.isHit || !enemy.target) continue;
        var enemyMc = enemy.target;
        var shotMc  = shot.target.getMovieClip();
        if (enemyMc.hitTest(shotMc.x, shotMc.y)) {
          this.hitEnemy({
            enemyId: enemy.id,
            shotId:  shot.id
          });
          this.removeEnemy({
            targetId: enemy.id
          });
          enemy.isHit = true;
          shot.isHit  = true;
          this.addEnemy();
        }
      }
    }
    // 自機アタリ判定
    if (this.player && this.player.getMovieClip() && this.player.getAlive() && !this.player.getHit()) {
      for(let enemy of this._enemies) {
        if (!enemy || enemy.isHit || !enemy.target) continue;
        var playerMc = this.player.getMovieClip();
        var enemyMc  = enemy.target;
        if (enemyMc.hitTest(playerMc.x, playerMc.y)) {
          enemyMc.hit();
          enemyMc.remove();
          this.player.hit();
          this.player.remove();
        }
      }
    }
  }

  hitEnemy(params) {
    var enemyId = params['enemyId'];
    var shotId  = params['shotId'];
    for (let enemy of this._enemies) {
      if (enemy.id == enemyId) {
        enemy.target.hit();
        break;
      }
    }
    if (shotId != null) {
      this.removeShot({ targetId: shotId });
    }
  }

  resetKey(code) {
    switch(code) {
      case this.ID_KEY_FIRE:
        this.key.isFIRE = false;
        break;
      case this.ID_KEY_LEFT:
        this.key.isLEFT = false;
        break;
      case this.ID_KEY_UP:
        this.key.isUP = false;
        break;
      case this.ID_KEY_RIGHT:
        this.key.isRIGHT = false;
        break;
      case this.ID_KEY_DOWN:
        this.key.isDOWN = false;
        break;
    }
  }

  onkeyDown(e) {
    this.code = e.keyCode;
    switch(e.keyCode) {
      case this.ID_KEY_FIRE:
        this.key.isFIRE = true;
        break;
      case this.ID_KEY_LEFT:
        this.key.isLEFT = true;
        break;
      case this.ID_KEY_UP:
        this.key.isUP = true;
        break;
      case this.ID_KEY_RIGHT:
        this.key.isRIGHT = true;
        break;
      case this.ID_KEY_DOWN:
        this.key.isDOWN = true;
        break;
    }
  }

  setBullet() {
    if (!this.player) return;
     this.firePlayer({
       x: this.playerX,
       y: this.playerY
     });
  }

  addEnemy() {
    var id = this.enemyCount;
    this.enemyCount++;
    var enemy = new Enemy(this.assets.enemy, this.bg, id);
    this._enemies.push({
      id: id,
      target: enemy,
      isHit: false
    });
    enemy.main();
  }

  firePlayer(params) {
    var id = this.shotCount;
    this.shotCount++;
    var shot = new Shot(params, this.bg, id);
    this._shots.push({
      id:     id,
      target: shot,
      isHit:  false
    });
    shot.main();
  }

  removeEnemy(param) {
    var targetId = param["targetId"];
    var enemy = [];
    for(let info of this._enemies) {
      if (info.id === targetId) {
        info.target.remove();
        info.target = null;
      } else {
        enemy.push(info);
      }
    }
    this._enemies = enemy;
  }

  removeShot(param) {
    var targetId = param["targetId"];
    var shot = [];
    for(let info of this._shots) {
      if (info.id == targetId) {
        info.target.remove();
        info.target = null;
      } else {
        shot.push(info);
      }
    }
    this._shots = shot;
  }

  moveUp() {
    if (!this.player) return;
    this.playerY -= this.speed;
    var height = this.player.getHeight();
    if (this.playerY < height) {
      this.playerY = height;
    }
    this.player.move({
      y: this.playerY
    });
  }

  moveDown() {
    if (!this.player) return;
    this.playerY += this.speed;
    if (this.playerY > this.bg._renderer.height) {
      this.playerY = this.bg._renderer.height;
    }
    this.player.move({
      y: this.playerY
    });
  }

  moveLeft() {
    if (!this.player) return;
    this.playerX -= this.speed;
    if (this.playerX < 0) {
      this.playerX = 0;
    }
    this.player.move({
      x: this.playerX
    });
  }

  moveRight() {
    if (!this.player) return;
    this.playerX += this.speed;
    if (this.playerX > this.bg._renderer.width) {
      this.playerX = this.bg._renderer.width;
    }
    this.player.move({
      x: this.playerX
    });
  }
}
