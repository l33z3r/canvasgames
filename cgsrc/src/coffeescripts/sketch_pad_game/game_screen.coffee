define ["game", "Settings", "./Gamevars", "util/PusherManager", "./Point"]
, (game, GlobalSettings, Gamevars, PusherManager, Point) ->
	sketch_pad_game_screen =
		enter: ->
			#init function
			alert("hi")

			bird_channel = PusherManager.pusher.subscribe("sketch_pad_game")

			bird_channel.bind "line_drawn", (data) ->
				Gamevars.nextRemoteUserLine = JSON.parse(data.line_data)

		ready: ->
		

		step: (delta) ->

		render: (delta) ->
			#game.layer.clear GlobalSettings.appBGColor

			#draw the next user line
			if Gamevars.nextRemoteUserLine?
				i = 0

				while i < Gamevars.nextRemoteUserLine.length
					x = Gamevars.nextRemoteUserLine[i].x
					y = Gamevars.nextRemoteUserLine[i].y

					color = "#FFF"

					game.layer.setPixel(color, x, y)

					i++

				Gamevars.nextRemoteUserLine = null

		mousedown: (event) ->

		mouseup: (event) ->
			# add a line to the users drawn lines
			if Gamevars.currentMousemove?
				Gamevars.userLines.push(Gamevars.currentMousemove)

				# send the line data
				eventData =
					channel_name: "sketch_pad_game"
					event_name: "line_drawn"
					json_data:
						line_data: JSON.stringify(Gamevars.currentMousemove)

				$.post "push_data", eventData

		mousemove: (event) ->
			if game.mouse.left
				mouseX = event.x
				mouseY = event.y
				Gamevars.currentMousemove.push(new Point(mouseX, mouseY))

		keydown: (event) ->

		keyup: (event) ->

		touchstart: (event) ->

		touchend: (event) ->

		touchmove: (event) ->

	return sketch_pad_game_screen