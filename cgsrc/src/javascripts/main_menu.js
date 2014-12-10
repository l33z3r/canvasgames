define(["require", "game", "Settings"], function(require, game, Settings) {
  var main_menu;
  main_menu = {
    create: function() {},
    ready: function() {},
    step: function(delta) {},
    render: function(delta) {
      game.layer.clear(Settings.appBGColor);
      return game.layer.fillStyle("#000").font("64px Arial").fillText("Click The Mouse To Play!!!", 200, 200);
    },
    mousedown: function(event) {
      var cancelFullScreen, doc, docEl, requestFullScreen;
      game.setState(require("game_screen"));
      doc = window.document;
      docEl = doc.documentElement;
      requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
      if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        return requestFullScreen.call(docEl);
      } else {
        return cancelFullScreen.call(doc);
      }
    },
    mouseup: function(event) {},
    mousemove: function(event) {},
    keydown: function(event) {},
    keyup: function(event) {}
  };
  return main_menu;
});
