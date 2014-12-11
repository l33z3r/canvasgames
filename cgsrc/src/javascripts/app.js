define(["require", "jquery", "pusher", "backbone", "message", "Point", "Player", "canvasquery", "playground", "game", "main_menu", "game_screen", "Motion", "Gamevars"], function(require, $, Pusher, Backbone, message, Point, Player, cq, playground, game, main_menu, game_screen, Motion, Gamevars) {
  var bird_channel, channel, pusher;
  game.main_menu = main_menu;
  game.game_screen = game_screen;
  Pusher.log = function(message) {
    if (window.console && window.console.log) {
      return window.console.log(message);
    }
  };
  pusher = new Pusher("1d4635759ded7a473634");
  channel = pusher.subscribe("test_channel");
  channel.bind("my_event", function(data) {
    return alert(data.message);
  });
  bird_channel = pusher.subscribe("bird_game");
  bird_channel.bind("line_drawn", function(data) {
    return Gamevars.nextRemoteUserLine = JSON.parse(data.line_data);
  });
  return window.setTimeout((function(_this) {
    return function() {
      return new Motion().startWatching();
    };
  })(this), 2000);
});
