define(["Player", "Point", "game", "Settings", "Gamevars"], function(Player, Point, game, Settings, Gamevars) {
  var game_screen;
  game_screen = {
    enter: function() {
      var i, numPlayers;
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
      currentPlayer.speedX = Math.max(Math.min(currentPlayer.speedX, Settings.maxPlayerSpeed), -Settings.maxPlayerSpeed);
      currentPlayer.speedY = Math.max(Math.min(currentPlayer.speedY, Settings.maxPlayerSpeed), -Settings.maxPlayerSpeed);
      newX = currentPlayer.currentPosition.x + (currentPlayer.speedX * delta);
      newY = currentPlayer.currentPosition.y + (currentPlayer.speedY * delta);
      newX = Math.min(Settings.gameWidth - Settings.playerWidth, Math.max(newX, 0));
      newY = Math.min(Settings.gameHeight - Settings.playerHeight, Math.max(newY, 0));
      currentPlayer.currentPosition.x = newX;
      return currentPlayer.currentPosition.y = newY;
    },
    render: function(delta) {
      var i, player, x, y, _results;
      game.layer.clear(Settings.appBGColor);
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
      var eventData, i, mouseX, mouseY, player, playerPos;
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
      eventData = {
        channel_name: "bird_game",
        event_name: "click",
        json_data: {
          x: mouseX,
          y: mouseY
        }
      };
      return $.post("push_data", eventData);
    },
    mouseup: function(event) {},
    mousemove: function(event) {},
    keydown: function(event) {},
    keyup: function(event) {},
    touchstart: function(event) {},
    touchend: function(event) {},
    touchmove: function(event) {}
  };
  return game_screen;
});
