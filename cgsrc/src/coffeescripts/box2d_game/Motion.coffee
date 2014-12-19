define ["./Gamevars"], (Gamevars) ->
  Motion = () ->
    @watchID = null

  Motion::startWatching = ->
    if navigator.accelerometer?
      onSuccess = (acceleration) ->
        #alert "Acceleration X: " + acceleration.x + "\n" + "Acceleration Y: " + acceleration.y + "\n" + "Acceleration Z: " + acceleration.z + "\n" + "Timestamp: " + acceleration.timestamp + "\n"
        Gamevars.currentReadAccelerationX = acceleration.x
        Gamevars.currentReadAccelerationY = acceleration.y
        Gamevars.currentReadAccelerationZ = acceleration.z

      onError = ->
        alert "onError!"

      options = frequency: 300 # Update every 300 milliseconds

      @watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options)
    else
      handleOrientationEvent = (event) ->
        #gamma is the left-to-right tilt in degrees, where right is positive
        #beta is the front-to-back tilt in degrees, where front is positive

        Gamevars.currentReadAccelerationX = event.gamma
        Gamevars.currentReadAccelerationY = -event.beta

        #console.log("new x y: " + x + " " + y)

      window.addEventListener("deviceorientation", handleOrientationEvent, false)

  return Motion