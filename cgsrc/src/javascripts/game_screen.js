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
        return Gamevars.currentPlayer.goDown();
      }
    },
    render: function(delta) {
      debugger;
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
    keyup: function(event) {}
  };
  return game_screen;
});
