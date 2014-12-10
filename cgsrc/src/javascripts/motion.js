define(function() {
  var onError, onSuccess, options, watchID;
  onSuccess = function(acceleration) {
    return alert("Acceleration X: " + acceleration.x + "\n" + "Acceleration Y: " + acceleration.y + "\n" + "Acceleration Z: " + acceleration.z + "\n" + "Timestamp: " + acceleration.timestamp + "\n");
  };
  onError = function() {
    return alert("onError!");
  };
  options = {
    frequency: 3000
  };
  return watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
});
