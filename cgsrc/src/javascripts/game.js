define(["require", "playground", "Settings"], function(require, playground, Settings) {
  var game, gameContainer;
  gameContainer = $('#game_container').get(0);
  debugger;
  game = playground({
    width: Settings.gameWidth,
    height: Settings.gameHeight,
    scaleToFit: true,
    create: function() {
      this.loadImages("bird_left");
      return this.loadImages("bird_right");
    },
    ready: function() {
      return this.setState(require("main_menu"));
    }
  });
  return game;
});
