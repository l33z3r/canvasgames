define ["jquery", "pusher", "backbone", "message", "Point", "Player", "canvasquery", "playground", "game", "main_menu", "game_screen"], 
($, pusher, Backbone, message, Point, Player, cq, playground, game, main_menu, game_screen) ->
	#debugger

	#assign the main menu and the game screen to the game
	game.main_menu = main_menu
	game.game_screen = game_screen

	# console.log("Point: #{Point}")
	
	# debugger
	
	# p = new Player("lee", new Point(0,0), "red")

	# debugger

	# message.showMessage "Here Is A Message!"