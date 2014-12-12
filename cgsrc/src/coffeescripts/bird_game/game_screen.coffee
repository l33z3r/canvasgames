define ["./Player", "./Point", "game", "Settings", "./Settings", "./Gamevars", "./Motion"]
, (Player, Point, game, GlobalSettings, Settings, Gamevars, Motion) ->

	bird_game_screen =
		enter: ->
			game.loadImages "bird_left"
			game.loadImages "bird_right"

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
			currentPlayer = Gamevars.currentPlayer

			maxPlayerAccel = Settings.maxPlayerAccel
			maxPlayerSpeed = Settings.maxPlayerSpeed

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
			currentPlayer.speedX = Math.max(Math.min(currentPlayer.speedX, maxPlayerSpeed), -maxPlayerSpeed)
			currentPlayer.speedY = Math.max(Math.min(currentPlayer.speedY, maxPlayerSpeed), -maxPlayerSpeed)

			newX = currentPlayer.currentPosition.x + (currentPlayer.speedX * delta)
			newY = currentPlayer.currentPosition.y + (currentPlayer.speedY * delta)

			#now clamp to screen boundries
			newX = Math.min(GlobalSettings.gameWidth - Settings.playerWidth, Math.max(newX, 0))
			newY = Math.min(GlobalSettings.gameHeight - Settings.playerHeight, Math.max(newY, 0))

			currentPlayer.currentPosition.x = newX
			currentPlayer.currentPosition.y = newY


		render: (delta) ->
			game.layer.clear GlobalSettings.appBGColor

			i = 0

			while i < Gamevars.players.length
				player = Gamevars.players[i]

				x = player.currentPosition.x
				y = player.currentPosition.y

				game.layer.drawRegion player.getImage(), player.getNextSprite(), x, y

				i++

		mousedown: (event) ->
			#discover which player was clicked
			i = 0

			while i < Gamevars.players.length
				mouseX = event.x
				mouseY = event.y
				player = Gamevars.players[i]
				playerPos = player.currentPosition

				if mouseX > playerPos.x and mouseX < playerPos.x + Settings.playerWidth and mouseY > playerPos.y and mouseY < playerPos.y + Settings.playerHeight
					Gamevars.currentPlayer = player
					break

				i++

		mouseup: (event) ->

		mousemove: (event) ->

		keydown: (event) ->

		keyup: (event) ->

		touchstart: (event) ->

		touchend: (event) ->

		touchmove: (event) ->

	return bird_game_screen
