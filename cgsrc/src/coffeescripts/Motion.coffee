define ["Gamevars"], (Gamevars) ->
  Motion = () ->
    @watchID = null

  Motion::startWatching = ->
    alert("start watch")

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
      handleMotionEvent = (event) ->
        Gamevars.currentReadAccelerationX = event.acceleration.x
        Gamevars.currentReadAccelerationY = event.acceleration.y
        Gamevars.currentReadAccelerationZ = event.acceleration.z

        #console.log("new x y: " + x + " " + y)

      window.addEventListener("devicemotion", handleMotionEvent, false)

    alert("here")

  return Motion