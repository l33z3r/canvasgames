define(["Gamevars"], function(Gamevars) {
  var Motion;
  Motion = function() {
    return this.watchID = null;
  };
  Motion.prototype.startWatching = function() {
    var handleOrientationEvent, onError, onSuccess, options;
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
      handleOrientationEvent = function(event) {
        Gamevars.currentReadAccelerationX = event.gamma;
        return Gamevars.currentReadAccelerationY = event.beta;
      };
      window.addEventListener("deviceorientation", handleOrientationEvent, false);
    }
    return alert("here");
  };
  return Motion;
});
