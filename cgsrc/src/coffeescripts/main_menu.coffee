define ["require", "game", "Settings"], (require, game, Settings) ->
	main_menu =
		create: ->

		ready: ->

		step: (delta) ->

		render: (delta) ->
			game.layer.clear Settings.appBGColor
			game.layer.fillStyle("#000").font("64px Arial").fillText "Click The Mouse To Play!!!", 200, 200

		mousedown: (event) ->

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