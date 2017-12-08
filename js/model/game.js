class Game {
  constructor(assets) {
    this.bg     = null;
    this.player = null;
    this.enemy  = null;
    this.tmp    = null;
    this.image  = assets.image;
    this.assets = assets;
    this.speed  = 1;
    this.code = 0;
    this.key = {
      isLEFT:  null,
      isRIGHT: null,
      isUP:    null,
      isDOWN:  null
    };
    this.ID_KEY_LEFT  = 37;
    this.ID_KEY_UP    = 38;
    this.ID_KEY_RIGHT = 39;
    this.ID_KEY_DOWN  = 40;
    this.onEnterFrame = this.onEnterFrame.bind(this);
  }

  resetKey(code) {
    switch(code) {
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

  init() {
    this.bg = new Stage(this.image);
    this.player = new Player(this.assets.player, this.bg);
    this.playerX = this.bg._renderer.width * 0.5;
    this.playerY = this.bg._renderer.height;
    for(var i in this.key) {
      this.key[i] = false;
    }
  }

  onEnterFrame() {
    requestAnimationFrame(this.onEnterFrame);
    if (this.tmp != this.code) {
      this.resetKey(this.tmp);
      this.tmp = this.code;
    }
    if (this.key.isLEFT) this.moveLeft();
    if (this.key.isRIGHT) this.moveRight();
    if (this.key.isUP) this.moveUp();
    if (this.key.isDOWN) this.moveDown();
  }

  moveUp() {
    if(!this.player) return;
     this.playerY -= this.speed;
     if (this.playerY < 0) {
      this.playerY = 0;
     }
     this.player.move({
       y: this.playerY
     });
  }

  moveDown() {
    if(!this.player) return;
    this.playerY += this.speed;
    if (this.playerY > this.bg._renderer.height) {
     this.playerY = this.bg._renderer.height;
    }
    this.player.move({
      y: this.playerY
    });
  }

  moveLeft() {
    if(!this.player) return;
    this.playerX -= this.speed;
    if (this.playerX < 0) {
     this.playerX = 0;
    }
    this.player.move({
      x: this.playerX
    });
  }

  moveRight() {
    if(!this.player) return;
    this.playerX += this.speed;
    if (this.playerX > this.bg._renderer.width) {
      this.playerX = this.bg._renderer.width;
    }
    this.player.move({
      x: this.playerX
    });
  }

  main() {
    this.init();
    this.onEnterFrame();
    $(window).on("keydown", this.onkeyDown.bind(this));
  }
}
