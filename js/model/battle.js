class Battle {
  constructor(target) {
    this.target = target;
  }

  attack(player, enemies) {
    for(let enemy of enemies) {
      if (!enemy || enemy.isHit || !enemy.target) continue;
      var playerMc = player.getMovieClip();
      if (!playerMc || !player.getAlive()) continue;
      var enemyMc  = enemy.target;
      if (enemyMc.hitTest(playerMc.x, playerMc.y)) {
        this.target.dispatcher({
          type: "HIT_PLAYER",
          object: {
            shotId: null
          }
        });
        this.target.dispatcher({
          type: "HIT_ENEMY",
          object: {
            enemyId: enemy.id
          }
        });
      }
    }
  }
  shotAttackPlayer(shots, enemies, param) {
    for (let shot of shots) {
      for (let enemy of enemies) {
        if (!enemy || enemy.isHit || !enemy.target) continue;
        if (!shot || shot.isHit || !shot.target) continue;
        var shotMc  = shot.target.getMovieClip();
        var enemyMc = enemy.target;
        if (enemyMc.hitTest(shotMc.x, shotMc.y)) {
          this.target.dispatcher({
            type: param["type"],
            object: {
              enemyId: enemy.id,
              shotId:  shot.id
            }
          });
          enemy.isHit = true;
          shot.isHit  = true;
        }
      }
    }
  }

  shotAttackEnemy(shots, player, param) {
    for (let shot of shots) {
      var shotMc  = shot.target.getMovieClip();
      if (!shot || !shotMc | shot.isHit || !shot.target) continue;
      if (!player || !player.getAlive()) continue;
      if (player.hitTest(shotMc.x, shotMc.y)) {
        this.target.dispatcher({
          type: param["type"],
          object: {
            shotId: shot.id
          }
        });
        player.isHit = true;
        shot.isHit   = true;
      }
    }
  }
}
