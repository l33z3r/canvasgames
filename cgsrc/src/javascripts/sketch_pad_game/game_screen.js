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
      return this.processLineStart(event);
    },
    mouseup: function(event) {
      return this.processLineEnd(event);
    },
    mousemove: function(event) {
      if (game.mouse.left) {
        return this.processLineProgress(event);
      }
    },
    keydown: function(event) {},
    keyup: function(event) {},
    touchstart: function(event) {
      return this.processLineStart(event);
    },
    touchend: function(event) {
      return this.processLineEnd(event);
    },
    touchmove: function(event) {
      return this.processLineProgress(event);
    },
    processLineStart: function(event) {
      var mouseX, mouseY;
      console.log("LINESTART");
      mouseX = event.x;
      mouseY = event.y;
      Gamevars.currentMousemove = [];
      return Gamevars.currentMousemove.push(new Point(mouseX, mouseY));
    },
    processLineEnd: function(event) {
      var eventData;
      console.log("LINEEND");
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
    processLineProgress: function(event) {
      var mouseX, mouseY;
      console.log("LINEMOVE");
      if (Gamevars.currentMousemove == null) {
        Gamevars.currentMousemove = [];
      }
      mouseX = event.x;
      mouseY = event.y;
      return Gamevars.currentMousemove.push(new Point(mouseX, mouseY));
    }
  };
  return sketch_pad_game_screen;
});
