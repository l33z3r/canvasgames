define ["game", "Settings", "./Settings", "./Gamevars", "util/PusherManager", "./Point"]
, (game, GlobalSettings, Settings, Gamevars, PusherManager, Point) ->
	sketch_pad_game_screen =
		enter: ->
			#init function
			sketch_pad_game_channel = PusherManager.pusher.subscribe("sketch_pad_game")

			sketch_pad_game_channel.bind "line_drawn", (data) ->
				Gamevars.nextRemoteUserLine = JSON.parse(data.line_data)

			@clearCanvas = true

		ready: ->
		

		step: (delta) ->

		render: (delta) ->

			if @clearCanvas
				game.layer.clear Settings.appBGColor
				@clearCanvas = false

			#draw the next user line
			if Gamevars.nextRemoteUserLine?
				i = 0

				while i < Gamevars.nextRemoteUserLine.length
					x = Gamevars.nextRemoteUserLine[i].x
					y = Gamevars.nextRemoteUserLine[i].y

					game.layer.context.lineWidth = 10
					game.layer.context.strokeStyle = '#fff'




					if i is 0
						game.layer.context.beginPath()
						game.layer.context.moveTo(x, y)
						i++
						continue



					game.layer.context.lineTo(x, y)
					game.layer.context.stroke()


					#game.layer.setPixel(color, x, y)







					i++

				Gamevars.nextRemoteUserLine = null

		mousedown: (event) ->
			@processLineStart(event)

		mouseup: (event) ->
			@processLineEnd(event)

		mousemove: (event) ->
			if game.mouse.left
				@processLineProgress(event)

		keydown: (event) ->

		keyup: (event) ->

		touchstart: (event) ->
			@processLineStart(event)

		touchend: (event) ->
			@processLineEnd(event)

		touchmove: (event) ->
			@processLineProgress(event)

		processLineStart: (event) ->
			console.log("LINESTART")
			mouseX = event.x
			mouseY = event.y

			Gamevars.currentMousemove = []
			Gamevars.currentMousemove.push(new Point(mouseX, mouseY))

		processLineEnd: (event) ->
			console.log("LINEEND")
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

		processLineProgress: (event) ->
			console.log("LINEMOVE")
			if !Gamevars.currentMousemove?
				Gamevars.currentMousemove = []

			mouseX = event.x
			mouseY = event.y
			Gamevars.currentMousemove.push(new Point(mouseX, mouseY))

	return sketch_pad_game_screen