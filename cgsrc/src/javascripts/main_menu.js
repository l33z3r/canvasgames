define(["require", "game", "Settings", "util/GameMenu", "util/GameMenuOption"], function(require, game, Settings, GameMenu, GameMenuOption) {
  var main_menu;
  main_menu = {
    create: function() {},
    ready: function() {},
    step: function(delta) {},
    render: function(delta) {
      var box2dFunc, height, items, menuTitle, pidgeonDashFunc, requestFullScreen, simpleChaseFunc, sketchPadFunc, width, x, y;
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
        return game.setState(game.bird_game_screen);
      };
      sketchPadFunc = function() {
        return game.setState(game.sketch_pad_game_screen);
      };
      box2dFunc = function() {
        return game.setState(game.box2d_game_screen);
      };
      simpleChaseFunc = function() {
        return game.setState(game.simple_chase_game_screen);
      };
      items.push(new GameMenuOption("Pidgeons Dash", pidgeonDashFunc));
      items.push(new GameMenuOption("Sketch Pad", sketchPadFunc));
      items.push(new GameMenuOption("Box2D", box2dFunc));
      items.push(new GameMenuOption("Simple Chase", simpleChaseFunc));
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
