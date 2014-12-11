define ["require", "game", "Settings"], (require, game, Settings) ->
	main_menu =
		create: ->

		ready: ->

		step: (delta) ->

		render: (delta) ->
			game.layer.clear Settings.appBGColor

			textWidth = 200
			x = Settings.gameWidth / 2.0 - textWidth
			game.layer.fillStyle("#000").font("40px Arial").fillText "Please Choose A Game", x, 100

			#bird game text boundry
			textWidth = 250
			textHeight = 80
			x = Settings.gameWidth / 2.0 - textWidth / 2.0
			y = 300
			game.layer.fillStyle("#000").font("40px Arial").fillText "Pidgeon Dash", x, y
			@game1Boundries = [x, y, textWidth, textHeight]

			#bird game text boundry
			textWidth = 220
			x = Settings.gameWidth / 2.0 - textWidth / 2.0
			game.layer.fillStyle("#000").font("40px Arial").fillText "Sketch Pad", x, 420

		mousedown: (event) ->
			#check which game was clicked
			mouseX = event.x
			mouseY = event.y

			#check bird game
			x = @game1Boundries[0]
			y = @game1Boundries[1]
			width = @game1Boundries[2]
			height = @game1Boundries[3]

			if mouseX > x and mouseX < x + width and mouseY > y and mouseY < y + height
				game.setState require("bird_game/game_screen")

				#request fullscreen
				doc = window.document
				docEl = doc.documentElement
				requestFullScreen = docEl.requestFullscreen or docEl.mozRequestFullScreen or docEl.webkitRequestFullScreen or docEl.msRequestFullscreen
				cancelFullScreen = doc.exitFullscreen or doc.mozCancelFullScreen or doc.webkitExitFullscreen or doc.msExitFullscreen
				if not doc.fullscreenElement and not doc.mozFullScreenElement and not doc.webkitFullscreenElement and not doc.msFullscreenElement
					requestFullScreen.call docEl
				else
					cancelFullScreen.call doc

		mouseup: (event) ->

		mousemove: (event) ->

		keydown: (event) ->

		keyup: (event) ->

	return main_menu