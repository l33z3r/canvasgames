define(["game"], function(game) {
  var Player;
  Player = function(name) {
    game.loadImages("bird_right");
    this.name = name;
    this.lastTick = 0;
    return this.duration = 1;
  };
  Player.prototype.getNextSprite = function() {
    var delta, frame, offset, sprite;
    delta = (Date.now() - this.lastTick) / 1000;
    frame = 8 * (delta % this.duration / this.duration) | 0;
    offset = 19;
    sprite = [offset + (frame * 109), 28, 109, 100];
    return sprite;
  };
  Player.prototype.getImage = function() {
    return game.images.bird_right;
  };
  return Player;
});
