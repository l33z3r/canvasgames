define(["require", "playground"], function(require, playground) {
  var game;
  game = playground({
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
