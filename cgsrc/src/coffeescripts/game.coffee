define ["require", "playground"], (require, playground) ->
	game = playground
		create: ->
			@loadImages "bird_left"
			@loadImages "bird_right"

		ready: ->
			@setState require("main_menu")

	return game