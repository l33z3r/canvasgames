define(["Gamevars"], function(Gamevars) {
  var Motion;
  Motion = function() {
    return this.watchID = null;
  };
  Motion.prototype.startWatching = function() {
    var handleMotionEvent, onError, onSuccess, options;
    alert("start watch");
    if (navigator.accelerometer != null) {
      onSuccess = function(acceleration) {
        Gamevars.currentReadAccelerationX = acceleration.x;
        Gamevars.currentReadAccelerationY = acceleration.y;
        return Gamevars.currentReadAccelerationZ = acceleration.z;
      };
      onError = function() {
        return alert("onError!");
      };
      options = {
        frequency: 300
      };
      this.watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    } else {
      handleMotionEvent = function(event) {
        Gamevars.currentReadAccelerationX = event.acceleration.x;
        Gamevars.currentReadAccelerationY = event.acceleration.y;
        return Gamevars.currentReadAccelerationZ = event.acceleration.z;
      };
      window.addEventListener("devicemotion", handleMotionEvent, false);
    }
    return alert("here");
  };
  return Motion;
});
