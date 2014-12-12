define(["game", "Settings", "./Gamevars", "util/PusherManager", "./Point"], function(game, GlobalSettings, Gamevars, PusherManager, Point) {
  var sketch_pad_game_screen;
  sketch_pad_game_screen = {
    enter: function() {
      var bird_channel;
      alert("hi");
      bird_channel = PusherManager.pusher.subscribe("sketch_pad_game");
      return bird_channel.bind("line_drawn", function(data) {
        return Gamevars.nextRemoteUserLine = JSON.parse(data.line_data);
      });
    },
    ready: function() {},
    step: function(delta) {},
    render: function(delta) {
      var color, i, x, y;
      if (Gamevars.nextRemoteUserLine != null) {
        i = 0;
        while (i < Gamevars.nextRemoteUserLine.length) {
          x = Gamevars.nextRemoteUserLine[i].x;
          y = Gamevars.nextRemoteUserLine[i].y;
          color = "#FFF";
          game.layer.setPixel(color, x, y);
          i++;
        }
        return Gamevars.nextRemoteUserLine = null;
      }
    },
    mousedown: function(event) {},
    mouseup: function(event) {
      var eventData;
      if (Gamevars.currentMousemove != null) {
        Gamevars.userLines.push(Gamevars.currentMousemove);
        eventData = {
          channel_name: "sketch_pad_game",
          event_name: "line_drawn",
          json_data: {
            line_data: JSON.stringify(Gamevars.currentMousemove)
          }
        };
        return $.post("push_data", eventData);
      }
    },
    mousemove: function(event) {
      var mouseX, mouseY;
      if (game.mouse.left) {
        mouseX = event.x;
        mouseY = event.y;
        return Gamevars.currentMousemove.push(new Point(mouseX, mouseY));
      }
    },
    keydown: function(event) {},
    keyup: function(event) {},
    touchstart: function(event) {},
    touchend: function(event) {},
    touchmove: function(event) {}
  };
  return sketch_pad_game_screen;
});
