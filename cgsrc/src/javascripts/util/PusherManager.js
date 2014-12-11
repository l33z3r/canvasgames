define(["pusher"], function(Pusher) {
  var PusherManager;
  PusherManager = function() {
    Pusher.log = function(message) {
      if (window.console && window.console.log) {
        return window.console.log(message);
      }
    };
    this.pusher = new Pusher("1d4635759ded7a473634");
  };
  return new PusherManager();
});
