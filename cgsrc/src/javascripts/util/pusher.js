define(["pusher"], function(Pusher) {
  var pusher;
  Pusher.log = function(message) {
    if (window.console && window.console.log) {
      return window.console.log(message);
    }
  };
  pusher = new Pusher("1d4635759ded7a473634");
  return pusher;
});
