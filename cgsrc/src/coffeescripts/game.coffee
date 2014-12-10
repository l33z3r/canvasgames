define ["require", "playground", "Settings"], (require, playground, Settings) ->
	gameContainer = $('#game_container').get(0)
	debugger
	game = playground
		#container: gameContainer
		width: Settings.gameWidth
		height: Settings.gameHeight
		scaleToFit: true

		create: ->
			@loadImages "bird_left"
			@loadImages "bird_right"

		ready: ->
			@setState require("main_menu")

	return game