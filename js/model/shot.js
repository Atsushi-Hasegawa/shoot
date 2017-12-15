class Shot {
  constructor(param, bg, id) {
    this.shot = null;
    this.bg   = bg;
    this.speed = 3;
    this.x    = param.x;
    this.y    = param.y;
    this.type = param.type;
    this.id   = id;
    this.execute = this.execute.bind(this);
  }

  init() {
    this.change();
    this.shot.x = this.x;
    this.shot.y = this.y - 30;
    this.bg.stage.addChild(this.shot);
  }

  getMovieClip() {
    return this.shot;
  }

  remove() {
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
        this.shot = new PIXI.Graphics().beginFill(0xFFFFFF,0.5).drawCircle(0,0,5).endFill();
        break;
    }
    return this.shot;
  }

  execute() {
    requestAnimationFrame(this.execute);
    var pos = this.shot.x - this.speed;
    if (pos > 0) {
      this.shot.x = pos;
    } else {
      this.remove();
    }
  }
}

