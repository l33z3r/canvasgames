define(["require", "game", "Settings"], function(require, game, Settings) {
  var main_menu;
  main_menu = {
    create: function() {},
    ready: function() {},
    step: function(delta) {},
    render: function(delta) {
      var textHeight, textWidth, x, y;
      game.layer.clear(Settings.appBGColor);
      textWidth = 200;
      x = Settings.gameWidth / 2.0 - textWidth;
      game.layer.fillStyle("#000").font("40px Arial").fillText("Please Choose A Game", x, 100);
      textWidth = 250;
      textHeight = 80;
      x = Settings.gameWidth / 2.0 - textWidth / 2.0;
      y = 300;
      game.layer.fillStyle("#000").font("40px Arial").fillText("Pidgeon Dash", x, y);
      this.game1Boundries = [x, y, textWidth, textHeight];
      textWidth = 220;
      x = Settings.gameWidth / 2.0 - textWidth / 2.0;
      return game.layer.fillStyle("#000").font("40px Arial").fillText("Sketch Pad", x, 420);
    },
    mousedown: function(event) {
      var cancelFullScreen, doc, docEl, height, mouseX, mouseY, requestFullScreen, width, x, y;
      mouseX = event.x;
      mouseY = event.y;
      x = this.game1Boundries[0];
      y = this.game1Boundries[1];
      width = this.game1Boundries[2];
      height = this.game1Boundries[3];
      if (mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height) {
        game.setState(require("bird_game/game_screen"));
        doc = window.document;
        docEl = doc.documentElement;
        requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
          return requestFullScreen.call(docEl);
        } else {
          return cancelFullScreen.call(doc);
        }
      }
    },
    mouseup: function(event) {},
    mousemove: function(event) {},
    keydown: function(event) {},
    keyup: function(event) {}
  };
  return main_menu;
});
