class Shot {
  constructor(param, bg, id) {
    this.shot = null;
    this.bg   = bg;
    this.speed = 3;
    this.x    = param.x;
    this.y    = param.y;
    this.type = param.type;
    this.id   = id;
    this.isActive = true;
  }

  init() {
    this.change();
    this.shot.x = this.x;
    this.shot.y = this.y;
    this.bg.stage.addChild(this.shot);
  }

  getMovieClip() {
    return this.shot;
  }

  remove() {
    this.isActive = false;
    this.bg.stage.removeChild(this.shot);
  }

  change() {
    switch(this.type) {
      case 'ellipse':
        this.shot = new PIXI.Graphics().beginFill(0xFF0000,0.5).drawEllipse(0,0,5,5).endFill();
        break;
      case 'rect':
        this.shot = new PIXI.Graphics().beginFill(0xFF6600,0.5).drawRect(0,0,10,5).endFill();
        break;
      default:
        this.shot = new PIXI.Graphics().beginFill(0x00ff33,0.6).drawCircle(0,0,5).endFill();
        break;
    }
    return this.shot;
  }

  update() {
    if (!this.isActive || !this.shot) return;
    var pos = this.shot.x - this.speed;
    if (pos > 0) {
      this.shot.x = pos;
    } else {
      this.remove();
    }
  }
}

class EnemyShot extends Shot {
  constructor(param, bg, id) {
    super(param, bg, id);
    this.speed = 3;
  }

  update() {
    if (!this.isActive || !this.shot) return;
    var pos = this.shot.x + this.speed;
    if (pos < this.bg._renderer.width) {
      this.shot.x = pos;
    } else {
      this.remove();
    }
  }
}

