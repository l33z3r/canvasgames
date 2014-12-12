define ["Player", "Point", "../game", "Settings", "Gamevars", "../util/PusherManager", "Motion"], (Player, Point, game, Settings, Gamevars, PusherManager, Motion) ->
	bird_game_screen =
		enter: ->
			#init function
			alert("hi")
			game.loadImages "bird_left"
			game.loadImages "bird_right"

			bird_channel = PusherManager.pusher.subscribe("bird_game")

			bird_channel.bind "line_drawn", (data) ->
				Gamevars.nextRemoteUserLine = JSON.parse(data.line_data)

			new Motion().startWatching()

			#initialize num players
			numPlayers = 1

			i = 0

			while i < numPlayers
				Gamevars.players.push new Player("Player #{i + 1}", new Point(i * 100, 100), "#FF0000")
				i++

			Gamevars.currentPlayer = Gamevars.players[0]

		ready: ->
		

		step: (delta) ->
			#console.log(delta)
			# if game.mouse.left
			# 	Gamevars.currentPlayer.currentPosition.x = game.mouse.x - (Settings.playerWidth / 2.0)
			# 	Gamevars.currentPlayer.currentPosition.y = game.mouse.y - (Settings.playerHeight / 2.0)
				
#			if game.keyboard.keys["left"]
#				Gamevars.currentPlayer.goLeft()
#
#			if game.keyboard.keys["right"]
#				Gamevars.currentPlayer.goRight()
#
#			if game.keyboard.keys["up"]
#				Gamevars.currentPlayer.goUp()
#
#			if game.keyboard.keys["down"]
#				Gamevars.currentPlayer.goDown()

#			if Gamevars.isTouching
#				#move the player towards the touchstart coord
#				playerX = Gamevars.currentPlayer.currentPosition.x
#				playerY = Gamevars.currentPlayer.currentPosition.y
#
#				touchX = Gamevars.touchStartPos.x
#				touchY = Gamevars.touchStartPos.y
#
#				if playerX > touchX + 10
#					Gamevars.currentPlayer.goLeft()
#				else if playerX < touchX - 10
#					Gamevars.currentPlayer.goRight()
#
#				if playerY > touchY + 10
#					Gamevars.currentPlayer.goUp()
#				else if playerY < touchY - 10
#					Gamevars.currentPlayer.goDown()





			currentPlayer = Gamevars.currentPlayer

			maxPlayerAccel = Settings.maxPlayerAccel
			maxPlayerSpeed = Settings.maxPlayerSpeed

			#this is temp
#			Gamevars.currentReadAccelerationX = window.x || 0
#			Gamevars.currentReadAccelerationY = window.y || 0





			#see: http://www.raywenderlich.com/35866/trigonometry-for-game-programming-part-1
			Gamevars.accelerometerX = (Gamevars.currentReadAccelerationX * Settings.accelFilteringFactor) + Gamevars.accelerometerX * (1.0 - Settings.accelFilteringFactor)
			Gamevars.accelerometerY = (Gamevars.currentReadAccelerationY * Settings.accelFilteringFactor) + Gamevars.accelerometerY * (1.0 - Settings.accelFilteringFactor)
			Gamevars.accelerometerZ = (Gamevars.currentReadAccelerationZ * Settings.accelFilteringFactor) + Gamevars.accelerometerZ * (1.0 - Settings.accelFilteringFactor)


			if game.keyboard.keys["right"]
				currentPlayer.accelX = maxPlayerAccel
			else if game.keyboard.keys["left"]
				currentPlayer.accelX = -maxPlayerAccel

			if game.keyboard.keys["up"]
				currentPlayer.accelY = -maxPlayerAccel
			else if game.keyboard.keys["down"]
				currentPlayer.accelY = maxPlayerAccel

			#work out the current players acceleration from accelerometer
			usingLandscape = true

			if usingLandscape
				if Gamevars.accelerometerY > 0.05
					currentPlayer.accelX = maxPlayerAccel
				else if Gamevars.accelerometerY < -0.05
					currentPlayer.accelX = -maxPlayerAccel

				if Gamevars.accelerometerX < -0.05
					currentPlayer.accelY = -maxPlayerAccel
				else if Gamevars.accelerometerX > 0.05
					currentPlayer.accelY = maxPlayerAccel
			else
				if Gamevars.accelerometerY > 0.05
					currentPlayer.accelY = maxPlayerAccel
				else if Gamevars.accelerometerY < -0.05
					currentPlayer.accelY = -maxPlayerAccel

				if Gamevars.accelerometerX < -0.05
					currentPlayer.accelX = maxPlayerAccel
				else if Gamevars.accelerometerX > 0.05
					currentPlayer.accelX = -maxPlayerAccel

			#now work out the current players speed from this
			currentPlayer.speedX += currentPlayer.accelX * delta
			currentPlayer.speedY += currentPlayer.accelY * delta

			#now cap the speed
			currentPlayer.speedX = Math.max(Math.min(currentPlayer.speedX, Settings.maxPlayerSpeed), -Settings.maxPlayerSpeed)
			currentPlayer.speedY = Math.max(Math.min(currentPlayer.speedY, Settings.maxPlayerSpeed), -Settings.maxPlayerSpeed)

			newX = currentPlayer.currentPosition.x + (currentPlayer.speedX * delta)
			newY = currentPlayer.currentPosition.y + (currentPlayer.speedY * delta)

			#now clamp to screen boundries
			newX = Math.min(Settings.gameWidth - Settings.playerWidth, Math.max(newX, 0))
			newY = Math.min(Settings.gameHeight - Settings.playerHeight, Math.max(newY, 0))

			currentPlayer.currentPosition.x = newX
			currentPlayer.currentPosition.y = newY


		render: (delta) ->
			#game.layer.clear Settings.appBGColor

			#game.layer.fillStyle("#000").font("20px Arial").fillText "count: " + Gamevars.count, 40, 40, 200
			
			i = 0
			
			while i < Gamevars.players.length				
				player = Gamevars.players[i]

				x = player.currentPosition.x
				y = player.currentPosition.y
				
				#game.layer.fillStyle("#000").font("12px Arial").fillText player.name, x - 10, y - 10, 100
				
				game.layer.drawRegion player.getImage(), player.getNextSprite(), x, y
				
				i++

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
			#discover which player was clicked
			i = 0

			while i < Gamevars.players.length
				mouseX = event.x
				mouseY = event.y
				player = Gamevars.players[i]
				playerPos = player.currentPosition

				# if (object1.x < object2.x + object2.width  && object1.x + object1.width  > object2.x &&
				# 	object1.y < object2.y + object2.height && object1.y + object1.height > object2.y)

				if mouseX > playerPos.x and mouseX < playerPos.x + Settings.playerWidth and mouseY > playerPos.y and mouseY < playerPos.y + Settings.playerHeight
					Gamevars.currentPlayer = player
					break

				i++

			Gamevars.currentMousemove = []
			Gamevars.currentMousemove.push(new Point(mouseX, mouseY))

#			Gamevars.count++

			#send a pusher event with the coords
			eventData =
				channel_name: "bird_game"
				event_name: "click"
				json_data:
					x: mouseX
					y: mouseY

			$.post "push_data", eventData

		mouseup: (event) ->
			# add a line to the users drawn lines
			if Gamevars.currentMousemove?
				Gamevars.userLines.push(Gamevars.currentMousemove)

				# send the line data
				eventData =
					channel_name: "bird_game"
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
#			Gamevars.isTouching = true
#			Gamevars.touchStartPos = new Point(event.x, event.y)
#			console.log("New touch start: " + Gamevars.touchStartPos.x, Gamevars.touchStartPos.y)

		touchend: (event) ->
#			Gamevars.isTouching = false
#			Gamevars.touchEndPos = new Point(event.x, event.y)
#			console.log("New touch end: " + Gamevars.touchEndPos.x, Gamevars.touchEndPos.y)

		touchmove: (event) ->

	return bird_game_screen