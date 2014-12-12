define(["require", "game", "Settings", "util/GameMenu", "util/GameMenuOption"], function(require, game, Settings, GameMenu, GameMenuOption) {
  var main_menu;
  main_menu = {
    create: function() {},
    ready: function() {},
    step: function(delta) {},
    render: function(delta) {
      var game3Func, height, items, menuTitle, pidgeonDashFunc, requestFullScreen, sketchPadFunc, width, x, y;
      game.layer.clear(Settings.appBGColor);
      items = [];
      requestFullScreen = function() {
        var cancelFullScreen, doc, docEl;
        doc = window.document;
        docEl = doc.documentElement;
        requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
          return requestFullScreen.call(docEl);
        } else {
          return cancelFullScreen.call(doc);
        }
      };
      pidgeonDashFunc = function() {
        alert("pd");
        game.setState(game.bird_game_screen);
        return requestFullScreen();
      };
      sketchPadFunc = function() {
        debugger;
        alert("sp");
        game.setState(game.sketch_pad_game_screen);
        return requestFullScreen();
      };
      game3Func = function() {
        alert("g3");
        return requestFullScreen();
      };
      items.push(new GameMenuOption("Pidgeons Dash", pidgeonDashFunc));
      items.push(new GameMenuOption("Sketch Pad", sketchPadFunc));
      items.push(new GameMenuOption("Game 3", game3Func));
      x = 0;
      y = Settings.gameHeight / (2 * 3.0);
      width = Settings.gameWidth;
      height = 2 * (Settings.gameHeight / 3.0);
      menuTitle = "Please Choose A Game";
      this.gameMenu = new GameMenu(menuTitle, items, game.layer, x, y, width, height);
      return this.gameMenu.render();
    },
    mousedown: function(event) {
      return this.gameMenu.handleClickEvent(event);
    },
    mouseup: function(event) {},
    mousemove: function(event) {},
    keydown: function(event) {},
    keyup: function(event) {}
  };
  return main_menu;
});
