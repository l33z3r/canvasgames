define ["require", "game", "Settings", "util/GameMenu", "util/GameMenuOption"], (require, game, Settings, GameMenu, GameMenuOption) ->
	main_menu =
		create: ->

		ready: ->

		step: (delta) ->

		render: (delta) ->
			game.layer.clear Settings.appBGColor

			items = []

			requestFullScreen = ->
				#request fullscreen
				doc = window.document
				docEl = doc.documentElement
				requestFullScreen = docEl.requestFullscreen or docEl.mozRequestFullScreen or docEl.webkitRequestFullScreen or docEl.msRequestFullscreen
				cancelFullScreen = doc.exitFullscreen or doc.mozCancelFullScreen or doc.webkitExitFullscreen or doc.msExitFullscreen
				if not doc.fullscreenElement and not doc.mozFullScreenElement and not doc.webkitFullscreenElement and not doc.msFullscreenElement
					requestFullScreen.call docEl
				else
					cancelFullScreen.call doc

			pidgeonDashFunc = ->
				game.setState game.bird_game_screen
				#requestFullScreen()

			sketchPadFunc = ->
				game.setState game.sketch_pad_game_screen
				#requestFullScreen()

			game3Func = ->
				alert("g3")
				requestFullScreen()

			items.push(new GameMenuOption("Pidgeons Dash", pidgeonDashFunc))
			items.push(new GameMenuOption("Sketch Pad", sketchPadFunc))
			items.push(new GameMenuOption("Game 3", game3Func))

			x = 0
			y = Settings.gameHeight / (2 * 3.0)

			width = Settings.gameWidth
			height = 2 * (Settings.gameHeight / 3.0)

			menuTitle = "Please Choose A Game"

			@gameMenu = new GameMenu(menuTitle, items, game.layer, x, y, width, height)
			@gameMenu.render()

		mousedown: (event) ->
			#check which game was clicked
			@gameMenu.handleClickEvent event

		mouseup: (event) ->

		mousemove: (event) ->

		keydown: (event) ->

		keyup: (event) ->

	return main_menu