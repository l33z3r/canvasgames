define(["Player", "Point", "game", "Settings", "Gamevars"], function(Player, Point, game, Settings, Gamevars) {
  var game_screen;
  game_screen = {
    enter: function() {
      var i, numPlayers;
      i = 0;
      numPlayers = 10;
      while (i < numPlayers - 1) {
        Gamevars.players.push(new Player("Player " + (i + 1), new Point(i * 100, 100), "#FF0000"));
        i++;
      }
      return Gamevars.currentPlayer = Gamevars.players[0];
    },
    ready: function() {},
    step: function(delta) {
      var playerX, playerY, touchX, touchY;
      if (game.keyboard.keys["left"]) {
        Gamevars.currentPlayer.goLeft();
      }
      if (game.keyboard.keys["right"]) {
        Gamevars.currentPlayer.goRight();
      }
      if (game.keyboard.keys["up"]) {
        Gamevars.currentPlayer.goUp();
      }
      if (game.keyboard.keys["down"]) {
        Gamevars.currentPlayer.goDown();
      }
      if (Gamevars.isTouching) {
        playerX = Gamevars.currentPlayer.currentPosition.x;
        playerY = Gamevars.currentPlayer.currentPosition.y;
        touchX = Gamevars.touchStartPos.x;
        touchY = Gamevars.touchStartPos.y;
        if (playerX > touchX) {
          Gamevars.currentPlayer.goLeft();
        } else {
          Gamevars.currentPlayer.goRight();
        }
        if (playerY > touchY) {
          return Gamevars.currentPlayer.goUp();
        } else {
          return Gamevars.currentPlayer.goDown();
        }
      }
    },
    render: function(delta) {
      var i, player, x, y, _results;
      game.layer.clear(Settings.appBGColor);
      game.layer.fillStyle("#000").font("20px Arial").fillText("count: " + Gamevars.count, 40, 40, 200);
      i = 0;
      _results = [];
      while (i < Gamevars.players.length) {
        player = Gamevars.players[i];
        x = player.currentPosition.x;
        y = player.currentPosition.y;
        game.layer.fillStyle("#000").font("12px Arial").fillText(player.name, x - 10, y - 10, 100);
        game.layer.drawRegion(player.getImage(), player.getNextSprite(), x, y);
        _results.push(i++);
      }
      return _results;
    },
    mousedown: function(event) {
      var i, mouseX, mouseY, player, playerPos;
      i = 0;
      while (i < Gamevars.players.length) {
        mouseX = event.x;
        mouseY = event.y;
        player = Gamevars.players[i];
        playerPos = player.currentPosition;
        if (mouseX > playerPos.x && mouseX < playerPos.x + Settings.playerWidth && mouseY > playerPos.y && mouseY < playerPos.y + Settings.playerHeight) {
          Gamevars.currentPlayer = player;
          break;
        }
        i++;
      }
      return Gamevars.count++;
    },
    mouseup: function(event) {},
    mousemove: function(event) {},
    keydown: function(event) {},
    keyup: function(event) {},
    touchstart: function(event) {
      debugger;
      Gamevars.isTouching = true;
      Gamevars.touchStartPos = new Point(event.x, event.y);
      return console.log("New touch start: " + Gamevars.touchStartPos.x, Gamevars.touchStartPos.y);
    },
    touchend: function(event) {
      Gamevars.isTouching = false;
      Gamevars.touchEndPos = new Point(event.x, event.y);
      return console.log("New touch end: " + Gamevars.touchEndPos.x, Gamevars.touchEndPos.y);
    },
    touchmove: function(event) {}
  };
  return game_screen;
});
