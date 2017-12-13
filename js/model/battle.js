class Battle {
  constructor(target) {
    this.target = target;
  }

  attack(player, enemies) {
    for(let enemy of enemies) {
      if (!enemy || enemy.isHit || !enemy.target) continue;
      var playerMc = player.getMovieClip();
      if (!playerMc) continue;
      var enemyMc  = enemy.target;
      if (enemyMc.hitTest(playerMc.x, playerMc.y)) {
        this.target.dispatcher({
          type: "HIT_PLAYER"
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
  shotAttackPlayer(shots, objects, param) {
    for (let shot of shots) {
      var shotMc  = shot.target.getMovieClip();
      if (!shot || !shotMc | shot.isHit || !shot.target) continue;
      for (let object of objects) {
        if (!object || object.isHit || !object.target) continue;
        var objectMc = object.target;
        if (objectMc.hitTest(shotMc.x, shotMc.y)) {
          this.target.dispatcher({
            type: param["type"],
            object: {
              enemyId: object.id,
              shotId:  shot.id
            }
          });
          object.isHit = true;
          shot.isHit  = true;
        }
      }
    }
  }

  shotAttackEnemy(shots, object, param) {
    for (let shot of shots) {
      var shotMc  = shot.target.getMovieClip();
      if (!shot || !shotMc | shot.isHit || !shot.target) continue;
      if (object.hitTest(shotMc.x, shotMc.y)) {
        this.target.dispatcher(param);
        object.isHit = true;
        shot.isHit  = true;
      }
    }
  }
}
