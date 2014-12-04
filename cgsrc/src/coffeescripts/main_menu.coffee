define ["require", "game", "Settings"], (require, game, Settings) ->
	main_menu =
		create: ->

		ready: ->

		step: (delta) ->

		render: (delta) ->
			game.layer.clear Settings.appBGColor
			game.layer.fillStyle("#000").font("64px Arial").fillText "Click The Mouse To Play!!!", 200, 200

		mousedown: (event) ->
			game.setState require("game_screen")

		mouseup: (event) ->

		mousemove: (event) ->

		keydown: (event) ->

		keyup: (event) ->

	return main_menu