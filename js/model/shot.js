class Shot {
  constructor(pos, bg, id) {
    this.shot = null;
    this.bg   = bg;
    this.speed = 1;
    this.x    = pos.x;
    this.y    = pos.y;
    this.id   = id;
    this.execute = this.execute.bind(this);
  }

  init() {
    this.shot = new PIXI.Graphics().beginFill(0xFFFFFF,0.5).drawCircle(0,0,5);
    this.shot.x = this.x;
    this.shot.y = this.y - 30;
    this.bg.stage.addChild(this.shot);
  }

  remove() {
    this.bg.stage.removeChild(this.shot);
  }
  getMovieClip() {
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

