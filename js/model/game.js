class Game {
  constructor(assets) {
    this.bg        = null;
    this.player    = null;
    this.enemy     = null;
    this.battle    = null;
    this._enemies  = [];
    this._shots    = [];
    this.listener  = [];
    this.enemyCount= null;
    this.shotCount = null;
    this.tmp       = null;
    this.image     = assets.image;
    this.assets    = assets;
    this.speed     = 3;
    this.code      = 0;
    this.key = {
      isLEFT:  null,
      isRIGHT: null,
      isUP:    null,
      isDOWN:  null,
      isFIRE:  null
    };
    this.ID_KEY_FIRE   = 32;
    this.ID_KEY_LEFT   = 37;
    this.ID_KEY_UP     = 38;
    this.ID_KEY_RIGHT  = 39;
    this.ID_KEY_DOWN   = 40;
    this.onTimer       = this.onTimer.bind(this);
    this.onEnterFrame  = this.onEnterFrame.bind(this);
  }

  init() {
    this.bg      = new Stage(this.image);
    this.player  = new Player(this.assets.player, this.bg);
    this.playerX = this.bg._renderer.width * 0.5;
    this.playerY = this.bg._renderer.height;
    this.battle  = new Battle(this);
    this.shotCount  = 0;
    this.enemyCount = 0;
    for(var i = 0; i < 2; i++) {
      this.addEnemy();
    }
    for(var i in this.key) {
      this.key[i] = false;
    }
  }

  removePlayer() {
    this.player.remove();
    this.gameOver();
  }

  replayGame() {
    this.player  = new Player(this.assets.player, this.bg);
    this.playerX = this.bg._renderer.width * 0.5;
    this.playerY = this.bg._renderer.height;
  }

  gameOver() {
    //XXX: styleに関しては検討する価値あり
    var style = new PIXI.TextStyle({
                      fontFamily: 'Arial',
                      fontSize: 36,
                      fontStyle: 'italic',
                      fontWeight: 'bold',
                      fill: ['#ffffff', '#00ff99'], // gradient
                      stroke: '#4a1850',
                      strokeThickness: 5,
                      dropShadow: true,
                      dropShadowColor: '#000000',
                      dropShadowBlur: 4,
                      dropShadowAngle: Math.PI / 6,
                      dropShadowDistance: 6,
                      wordWrap: true,
                      wordWrapWidth: 440
                    });
    var text = new PIXI.Text('GAME OVER', style);
    text.x = this.bg._renderer.width * 0.5;
    text.y = this.bg._renderer.height * 0.5;
    this.bg.stage.addChild(text);
    var _this = this;
    $(window).on('click', function() {
      _this.bg.stage.removeChild(text);
      _this.dispatcher({
        type: "REPLAY_GAME"
      });
    });
  }

  start() {
    this.onEnterFrame();
    this.onTimer();
    $(window).on("keydown", this.onkeyDown.bind(this));
    var _this = this;
    this.addListener({
      type: "ADD_ENEMY",
      callback: function() {
        _this.addEnemy()
      }
    });
    this.addListener({
      type: "REMOVE_ENEMY",
      callback: function(evt) {
        _this.removeEnemy({
          targetId: evt["targetId"]
        })
      }
    });
    this.addListener({
      type: "FIRE_ENEMY",
      callback: function(evt) {
        _this.fireEnemy({
          x: evt.x,
          y: evt.y
        });
      }
    });
    this.addListener({
      type: "REMOVE_SHOT_ENEMY",
      callback: function(evt) {
        _this.removeShot({
          targetId: evt["targetId"]
        });
      }
    });
    this.addListener({
      type: "FIRE_PLAYER",
      callback: function(evt) {
        _this.firePlayer({
          x: evt.x,
          y: evt.y
        })
      }
    });
    this.addListener({
      type: "HIT_ENEMY",
      callback: function(evt) {
        _this.hitEnemy({
          enemyId: evt["enemyId"],
          shotId:  evt["shotId"]
        })
      }
    });
    this.addListener({
      type: "HIT_PLAYER",
      callback: function(evt) {
        _this.hitPlayer()
      }
    });
    this.addListener({
      type: "REMOVE_PLAYER",
      callback: function(evt) {
        _this.removePlayer()
      }
    });
    this.addListener({
      type: "REPLAY_GAME",
      callback: function(evt) {
        _this.replayGame()
      }
    });
  }

  addListener(params) {
    var type = params["type"];
    var callback = params["callback"];
    this.listener.push({
      type: type,
      callback: callback
    });
  }

  dispatcher(params) {
    if (!params || !params["type"]) return;
    var type   = params["type"];
    var object = params["object"];
    for (let listener of this.listener) {
      if (listener.type == type) {
        if (object) {
          listener.callback(object);
        } else {
          listener.callback();
        }
      }
    }
  }
  onTimer() {
    requestAnimationFrame(this.onTimer);
    if (this._enemies.length < 3) {
      this.dispatcher({
        type: "ADD_ENEMY"
      });
    } else {
      for (let enemy of this._enemies) {
        var _enemy = enemy.target;
        if (!enemy || enemy.isHit || !_enemy || !_enemy.getPosition()) continue;
        if (_enemy.getPosition().x < this.bg._renderer.width) continue;
        _enemy.remove();
        this._enemies.splice(enemy);
      }
    }
  }

  onEnterFrame() {
    requestAnimationFrame(this.onEnterFrame);
    if (this.tmp != this.code) {
      this.resetKey(this.tmp);
      this.tmp = this.code;
    }
    if (this.key.isFIRE) {
      this.resetKey(this.code);
      this.setBullet();
    }
    if (this.key.isLEFT) this.moveLeft();
    if (this.key.isRIGHT) this.moveRight();
    if (this.key.isUP) this.moveUp();
    if (this.key.isDOWN) this.moveDown();

    // 敵のアタリ判定
    this.battle.shotAttackPlayer(this._shots, this._enemies, { type: "HIT_ENEMY"});
    // 自機アタリ判定
    if (this.player && this.player.getMovieClip() && this.player.getAlive() && !this.player.getHit()) {
      //this.battle.shotAttackEnemy(this._shots, this.player, { type: "HIT_PLAYER"});
      this.battle.attack(this.player, this._enemies);
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
    this.dispatcher({
      type: "REMOVE_ENEMY",
      object: {
        targetId: enemyId
      }
    });
    if (shotId !== null) {
      this.dispatcher({
        type: "REMOVE_SHOT_ENEMY",
        object: {
          targetId: shotId
        }
      });
    }
  }

  hitPlayer() {
    this.player.setHit();
    this.dispatcher({
      type: "REMOVE_PLAYER"
    });
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
    this.dispatcher({
      type: "FIRE_PLAYER",
      object: {
        x: this.playerX,
        y: this.playerY
      }
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
    enemy.run();
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
    shot.init();
    shot.execute();
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
    this.bg.move({
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
    this.bg.move({
      x: this.playerX
    });
  }
}
