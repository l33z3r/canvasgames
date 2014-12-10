require.config 
	shim: 
		backbone:
			deps: ["jquery"]
			exports: "Backbone"
		Player:
			deps: ["Point"]
		playground:
			deps: ["canvasquery"]
			exports: "playground"
		canvasquery:
			exports: "cq"
		pusher:
			exports: "Pusher"

	paths:  		
	 	jquery: "bower_lib/jquery/dist/jquery"
	 	underscore: "bower_lib/underscore/underscore"
	 	backbone: "bower_lib/backbone/backbone"
	 	pusher: "bower_lib/pusher/dist/pusher.min"
	 	canvasquery: "lib/canvasquery"		 
	 	playground: "lib/playground"		 