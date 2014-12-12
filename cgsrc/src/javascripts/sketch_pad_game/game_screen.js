define(["game", "Settings", "./Settings", "./Gamevars", "util/PusherManager", "./Point"], function(game, GlobalSettings, Settings, Gamevars, PusherManager, Point) {
  var sketch_pad_game_screen;
  sketch_pad_game_screen = {
    enter: function() {
      var sketch_pad_game_channel;
      sketch_pad_game_channel = PusherManager.pusher.subscribe("sketch_pad_game");
      sketch_pad_game_channel.bind("line_drawn", function(data) {
        return Gamevars.nextRemoteUserLine = JSON.parse(data.line_data);
      });
      return this.clearCanvas = true;
    },
    ready: function() {},
    step: function(delta) {},
    render: function(delta) {
      var i, x, y;
      if (this.clearCanvas) {
        game.layer.clear(Settings.appBGColor);
        this.clearCanvas = false;
      }
      if (Gamevars.nextRemoteUserLine != null) {
        i = 0;
        while (i < Gamevars.nextRemoteUserLine.length) {
          x = Gamevars.nextRemoteUserLine[i].x;
          y = Gamevars.nextRemoteUserLine[i].y;
          game.layer.context.lineWidth = 10;
          game.layer.context.strokeStyle = '#fff';
          if (i === 0) {
            game.layer.context.beginPath();
            game.layer.context.moveTo(x, y);
            i++;
            continue;
          }
          game.layer.context.lineTo(x, y);
          game.layer.context.stroke();
          i++;
        }
        return Gamevars.nextRemoteUserLine = null;
      }
    },
    mousedown: function(event) {
      var mouseX, mouseY;
      mouseX = event.x;
      mouseY = event.y;
      Gamevars.currentMousemove = [];
      return Gamevars.currentMousemove.push(new Point(mouseX, mouseY));
    },
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
        if (Gamevars.currentMousemove == null) {
          Gamevars.currentMousemove = [];
        }
        mouseX = event.x;
        mouseY = event.y;
        return Gamevars.currentMousemove.push(new Point(mouseX, mouseY));
      }
    },
    keydown: function(event) {},
    keyup: function(event) {},
    touchstart: function(event) {
      return this.mousedown(event);
    },
    touchend: function(event) {
      return this.mouseup(event);
    },
    touchmove: function(event) {
      return this.mousemove(event);
    }
  };
  return sketch_pad_game_screen;
});
