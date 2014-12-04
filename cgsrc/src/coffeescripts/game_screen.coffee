define ["Player", "Point", "game", "Settings", "Gamevars"], (Player, Point, game, Settings, Gamevars) ->
	game_screen =
		enter: ->
			i = 0
			
			numPlayers = 10

			while i < numPlayers - 1
				Gamevars.players.push new Player("Player #{i + 1}", new Point(i * 100, 100), "#FF0000")
				i++

			Gamevars.currentPlayer = Gamevars.players[0]

		ready: ->
		

		step: (delta) ->
			
			# if game.mouse.left
			# 	Gamevars.currentPlayer.currentPosition.x = game.mouse.x - (Settings.playerWidth / 2.0)
			# 	Gamevars.currentPlayer.currentPosition.y = game.mouse.y - (Settings.playerHeight / 2.0)
				
			if game.keyboard.keys["left"]
				Gamevars.currentPlayer.goLeft()
			
			if game.keyboard.keys["right"]
				Gamevars.currentPlayer.goRight()
			
			if game.keyboard.keys["up"]
				Gamevars.currentPlayer.goUp()
			
			if game.keyboard.keys["down"]
				Gamevars.currentPlayer.goDown()

			if Gamevars.isTouching
				#move the player towards the touchstart coord
				playerX = Gamevars.currentPlayer.currentPosition.x
				playerY = Gamevars.currentPlayer.currentPosition.y

				touchX = Gamevars.touchStartPos.x
				touchY = Gamevars.touchStartPos.y

				if playerX > touchX
					Gamevars.currentPlayer.goLeft()
				else if playerX < touchX
					Gamevars.currentPlayer.goRight()

				if playerY > touchY
					Gamevars.currentPlayer.goUp()
				else if playerY < touchY
					Gamevars.currentPlayer.goDown()



		render: (delta) ->
			game.layer.clear Settings.appBGColor
			game.layer.fillStyle("#000").font("20px Arial").fillText "count: " + Gamevars.count, 40, 40, 200
			
			i = 0
			
			while i < Gamevars.players.length				
				player = Gamevars.players[i]

				x = player.currentPosition.x
				y = player.currentPosition.y
				
				game.layer.fillStyle("#000").font("12px Arial").fillText player.name, x - 10, y - 10, 100
				
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

				# if (object1.x < object2.x + object2.width  && object1.x + object1.width  > object2.x &&
				# 	object1.y < object2.y + object2.height && object1.y + object1.height > object2.y)

				if mouseX > playerPos.x and mouseX < playerPos.x + Settings.playerWidth and mouseY > playerPos.y and mouseY < playerPos.y + Settings.playerHeight
					Gamevars.currentPlayer = player
					break

				i++




			Gamevars.count++

		mouseup: (event) ->

		mousemove: (event) ->

		keydown: (event) ->

		keyup: (event) ->

		touchstart: (event) ->
			debugger
			Gamevars.isTouching = true
			Gamevars.touchStartPos = new Point(event.x, event.y)
			console.log("New touch start: " + Gamevars.touchStartPos.x, Gamevars.touchStartPos.y)

		touchend: (event) ->
			Gamevars.isTouching = false
			Gamevars.touchEndPos = new Point(event.x, event.y)
			console.log("New touch end: " + Gamevars.touchEndPos.x, Gamevars.touchEndPos.y)

		touchmove: (event) ->

	return game_screen