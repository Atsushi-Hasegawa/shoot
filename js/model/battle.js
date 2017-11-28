class Battle {
  constructor(player, enemy, bg) {
    this.player = player;
    this.enemy  = enemy;
    this.bg     = bg;
    this.attack = this.attack.bind(this);
  }

  attack() {
    requestAnimationFrame(this.attack);
    for(var i = 0; i < this.player.length; i++) {
      for(var j = 0; j < this.enemy.length; j++) {
        if (this.player[i].x == this.enemy[j].x) {
          this.bg.stage.removeChild(this.player[i]);
          this.player.splice(i, 1);
        }
      }
    }
  }

}
