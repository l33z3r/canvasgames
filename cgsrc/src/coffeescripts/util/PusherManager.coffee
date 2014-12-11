define ["pusher"], (Pusher) ->

  PusherManager = ->
    # Enable pusher logging - don't include this in production
    Pusher.log = (message) ->
      window.console.log message  if window.console and window.console.log

    @pusher = new Pusher("1d4635759ded7a473634")
    return

  return new PusherManager()