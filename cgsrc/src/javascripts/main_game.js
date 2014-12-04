define(["require", "playground"], function(playground) {
  var main_game;
  main_game = playground({
    create: function() {
      return this.loadImages("bird");
    },
    ready: function() {
      return this.setState(require("main_menu"));
    }
  });
  return main_game;
});
