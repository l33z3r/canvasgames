define ["require", "jquery", "pusher", "backbone", "message", "Point", "Player", "canvasquery", "playground", "game", "main_menu", "game_screen", "Motion"],
(require, $, Pusher, Backbone, message, Point, Player, cq, playground, game, main_menu, game_screen, Motion) ->
	#assign the main menu and the game screen to the game
	game.main_menu = main_menu
	game.game_screen = game_screen

	# Enable pusher logging - don't include this in production
	Pusher.log = (message) ->
		window.console.log message  if window.console and window.console.log

	pusher = new Pusher("1d4635759ded7a473634")
	channel = pusher.subscribe("test_channel")

	channel.bind "my_event", (data) ->
		alert data.message

	window.setTimeout =>
		new Motion().startWatching()
	, 5000