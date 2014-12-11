define(["Point", "game"], function(Point, game) {
  var Player;
  Player = function(name, initialPosition, colour) {
    this.name = name;
    this.initialPosition = initialPosition;
    this.currentPosition = new Point(initialPosition.x, initialPosition.y);
    this.colour = colour;
    this.lastTick = 0;
    this.duration = 1;
    this.orientation = "right";
    this.accelX = 0;
    this.accelY = 0;
    this.speedX = 0;
    return this.speedY = 0;
  };
  Player.prototype.getNextSprite = function() {
    var delta, frame, offset, sprite;
    delta = (Date.now() - this.lastTick) / 1000;
    frame = 8 * (delta % this.duration / this.duration) | 0;
    offset = 19;
    sprite = [offset + (frame * 109), 28, 109, 100];
    return sprite;
  };
  Player.prototype.goLeft = function() {
    this.currentPosition.x -= 10;
    return this.orientation = "left";
  };
  Player.prototype.goRight = function() {
    this.currentPosition.x += 10;
    return this.orientation = "right";
  };
  Player.prototype.goUp = function() {
    return this.currentPosition.y -= 10;
  };
  Player.prototype.goDown = function() {
    return this.currentPosition.y += 10;
  };
  Player.prototype.getImage = function() {
    if (this.orientation === "left") {
      return game.images.bird_left;
    } else {
      return game.images.bird_right;
    }
  };
  return Player;
});
