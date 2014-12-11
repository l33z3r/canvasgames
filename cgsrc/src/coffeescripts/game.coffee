define ["require", "playground", "Settings"], (require, playground, Settings) ->
	gameContainer = $('#game_container').get(0)

	game = playground
		#container: gameContainer
		width: Settings.gameWidth
		height: Settings.gameHeight
		scaleToFit: true

		create: ->


		ready: ->
			@setState require("main_menu")

	return game