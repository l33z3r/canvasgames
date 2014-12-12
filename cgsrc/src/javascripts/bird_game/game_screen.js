define(["./Player", "./Point", "game", "Settings", "./Settings", "./Gamevars", "util/PusherManager", "./Motion"], function(Player, Point, game, GlobalSettings, Settings, Gamevars, PusherManager, Motion) {
  var bird_game_screen;
  bird_game_screen = {
    enter: function() {
      var i, numPlayers;
      game.loadImages("bird_left");
      game.loadImages("bird_right");
      new Motion().startWatching();
      numPlayers = 1;
      i = 0;
      while (i < numPlayers) {
        Gamevars.players.push(new Player("Player " + (i + 1), new Point(i * 100, 100), "#FF0000"));
        i++;
      }
      return Gamevars.currentPlayer = Gamevars.players[0];
    },
    ready: function() {},
    step: function(delta) {
      var currentPlayer, maxPlayerAccel, maxPlayerSpeed, newX, newY, usingLandscape;
      currentPlayer = Gamevars.currentPlayer;
      maxPlayerAccel = Settings.maxPlayerAccel;
      maxPlayerSpeed = Settings.maxPlayerSpeed;
      Gamevars.accelerometerX = (Gamevars.currentReadAccelerationX * Settings.accelFilteringFactor) + Gamevars.accelerometerX * (1.0 - Settings.accelFilteringFactor);
      Gamevars.accelerometerY = (Gamevars.currentReadAccelerationY * Settings.accelFilteringFactor) + Gamevars.accelerometerY * (1.0 - Settings.accelFilteringFactor);
      Gamevars.accelerometerZ = (Gamevars.currentReadAccelerationZ * Settings.accelFilteringFactor) + Gamevars.accelerometerZ * (1.0 - Settings.accelFilteringFactor);
      if (game.keyboard.keys["right"]) {
        currentPlayer.accelX = maxPlayerAccel;
      } else if (game.keyboard.keys["left"]) {
        currentPlayer.accelX = -maxPlayerAccel;
      }
      if (game.keyboard.keys["up"]) {
        currentPlayer.accelY = -maxPlayerAccel;
      } else if (game.keyboard.keys["down"]) {
        currentPlayer.accelY = maxPlayerAccel;
      }
      usingLandscape = true;
      if (usingLandscape) {
        if (Gamevars.accelerometerY > 0.05) {
          currentPlayer.accelX = maxPlayerAccel;
        } else if (Gamevars.accelerometerY < -0.05) {
          currentPlayer.accelX = -maxPlayerAccel;
        }
        if (Gamevars.accelerometerX < -0.05) {
          currentPlayer.accelY = -maxPlayerAccel;
        } else if (Gamevars.accelerometerX > 0.05) {
          currentPlayer.accelY = maxPlayerAccel;
        }
      } else {
        if (Gamevars.accelerometerY > 0.05) {
          currentPlayer.accelY = maxPlayerAccel;
        } else if (Gamevars.accelerometerY < -0.05) {
          currentPlayer.accelY = -maxPlayerAccel;
        }
        if (Gamevars.accelerometerX < -0.05) {
          currentPlayer.accelX = maxPlayerAccel;
        } else if (Gamevars.accelerometerX > 0.05) {
          currentPlayer.accelX = -maxPlayerAccel;
        }
      }
      currentPlayer.speedX += currentPlayer.accelX * delta;
      currentPlayer.speedY += currentPlayer.accelY * delta;
      currentPlayer.speedX = Math.max(Math.min(currentPlayer.speedX, maxPlayerSpeed), -maxPlayerSpeed);
      currentPlayer.speedY = Math.max(Math.min(currentPlayer.speedY, maxPlayerSpeed), -maxPlayerSpeed);
      newX = currentPlayer.currentPosition.x + (currentPlayer.speedX * delta);
      newY = currentPlayer.currentPosition.y + (currentPlayer.speedY * delta);
      newX = Math.min(GlobalSettings.gameWidth - Settings.playerWidth, Math.max(newX, 0));
      newY = Math.min(GlobalSettings.gameHeight - Settings.playerHeight, Math.max(newY, 0));
      currentPlayer.currentPosition.x = newX;
      return currentPlayer.currentPosition.y = newY;
    },
    render: function(delta) {
      var i, player, x, y, _results;
      game.layer.clear(GlobalSettings.appBGColor);
      i = 0;
      _results = [];
      while (i < Gamevars.players.length) {
        player = Gamevars.players[i];
        x = player.currentPosition.x;
        y = player.currentPosition.y;
        game.layer.drawRegion(player.getImage(), player.getNextSprite(), x, y);
        _results.push(i++);
      }
      return _results;
    },
    mousedown: function(event) {
      var i, mouseX, mouseY, player, playerPos, _results;
      i = 0;
      _results = [];
      while (i < Gamevars.players.length) {
        mouseX = event.x;
        mouseY = event.y;
        player = Gamevars.players[i];
        playerPos = player.currentPosition;
        if (mouseX > playerPos.x && mouseX < playerPos.x + Settings.playerWidth && mouseY > playerPos.y && mouseY < playerPos.y + Settings.playerHeight) {
          Gamevars.currentPlayer = player;
          break;
        }
        _results.push(i++);
      }
      return _results;
    },
    mouseup: function(event) {},
    mousemove: function(event) {},
    keydown: function(event) {},
    keyup: function(event) {},
    touchstart: function(event) {},
    touchend: function(event) {},
    touchmove: function(event) {}
  };
  return bird_game_screen;
});
