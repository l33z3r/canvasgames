define ["game", "Settings", "./Settings", "./Gamevars", "util/PusherManager", "box2d", "stats", "./Motion"]
, (game, GlobalSettings, Settings, Gamevars, PusherManager, Box2D, Stats, Motion) ->
	box2d_game_screen =
		enter: ->
			new Motion().startWatching()

			@clearCanvas = true

			debugger
			Gamevars.stats = new Stats()
			document.body.appendChild(Gamevars.stats.domElement)

			@b2Vec2 = Box2D.Common.Math.b2Vec2
			@b2BodyDef = Box2D.Dynamics.b2BodyDef
			@b2Body = Box2D.Dynamics.b2Body
			@b2FixtureDef = Box2D.Dynamics.b2FixtureDef
			@b2Fixture = Box2D.Dynamics.b2Fixture
			@b2World = Box2D.Dynamics.b2World
			@b2MassData = Box2D.Collision.Shapes.b2MassData
			@b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
			@b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
			@b2DebugDraw = Box2D.Dynamics.b2DebugDraw

			gravity = new @b2Vec2(Gamevars.currentGravX, Gamevars.currentGravY)
			Gamevars.world = new @b2World(gravity, true) #allow sleep

			SCALE = 30
			fixDef = new @b2FixtureDef
			fixDef.density = 1.0
			fixDef.friction = 0.5
			fixDef.restitution = 0.2
			bodyDef = new @b2BodyDef

			#create bottom ground
			bodyDef.type = @b2Body.b2_staticBody

			# positions the center of the object (not upper left!)
			bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / 2 / SCALE
			bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / SCALE
			fixDef.shape = new @b2PolygonShape

			# half width, half height. eg actual height here is 1 unit
			fixDef.shape.SetAsBox ((GlobalSettings.gameWidth * game.scale) / SCALE) / 2, (10 / SCALE) / 2
			Gamevars.world.CreateBody(bodyDef).CreateFixture fixDef

			#create left ground
			bodyDef.type = @b2Body.b2_staticBody

			# positions the center of the object (not upper left!)
			bodyDef.position.x = 0 / SCALE
			bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / 2 / SCALE
			fixDef.shape = new @b2PolygonShape

			# half width, half height. eg actual height here is 1 unit
			fixDef.shape.SetAsBox (10 / SCALE) / 2, ((GlobalSettings.gameWidth * game.scale) / SCALE) / 2
			Gamevars.world.CreateBody(bodyDef).CreateFixture fixDef

			#create right ground
			bodyDef.type = @b2Body.b2_staticBody

			# positions the center of the object (not upper left!)
			bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / SCALE
			bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / 2 / SCALE
			fixDef.shape = new @b2PolygonShape

			# half width, half height. eg actual height here is 1 unit
			fixDef.shape.SetAsBox (10 / SCALE) / 2, ((GlobalSettings.gameWidth * game.scale) / SCALE) / 2
			Gamevars.world.CreateBody(bodyDef).CreateFixture fixDef

			#create top ground
			bodyDef.type = @b2Body.b2_staticBody

			# positions the center of the object (not upper left!)
			bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / 2 / SCALE
			bodyDef.position.y = 0 / SCALE
			fixDef.shape = new @b2PolygonShape

			# half width, half height. eg actual height here is 1 unit
			fixDef.shape.SetAsBox ((GlobalSettings.gameWidth * game.scale) / SCALE) / 2, (10 / SCALE) / 2
			Gamevars.world.CreateBody(bodyDef).CreateFixture fixDef

			#create some objects
			bodyDef.type = @b2Body.b2_dynamicBody
			i = 0

			while i < 10
				if Math.random() > 0.5
					fixDef.shape = new @b2PolygonShape
					#half width
					fixDef.shape.SetAsBox Math.random() + 0.1, Math.random() + 0.1 #half height
				else
					fixDef.shape = new @b2CircleShape(Math.random() + 0.1) #radius
				bodyDef.position.x = Math.random() * 25
				bodyDef.position.y = Math.random() * 10
				Gamevars.world.CreateBody(bodyDef).CreateFixture fixDef
				++i

			#setup debug draw
			debugDraw = new @b2DebugDraw()
			debugDraw.SetSprite $('canvas').get(0).getContext("2d")
			debugDraw.SetDrawScale SCALE
			debugDraw.SetFillAlpha 0.3
			debugDraw.SetLineThickness 1.0
			debugDraw.SetFlags @b2DebugDraw.e_shapeBit | @b2DebugDraw.e_jointBit
			Gamevars.world.SetDebugDraw debugDraw

		ready: ->
		

		step: (delta) ->
			debugger

			Gamevars.accelerometerX = (Gamevars.currentReadAccelerationX * Settings.accelFilteringFactor) + Gamevars.accelerometerX * (1.0 - Settings.accelFilteringFactor)
			Gamevars.accelerometerY = (Gamevars.currentReadAccelerationY * Settings.accelFilteringFactor) + Gamevars.accelerometerY * (1.0 - Settings.accelFilteringFactor)
			Gamevars.accelerometerZ = (Gamevars.currentReadAccelerationZ * Settings.accelFilteringFactor) + Gamevars.accelerometerZ * (1.0 - Settings.accelFilteringFactor)

			#work out the current gravity from accelerometer
			usingLandscape = true

			if usingLandscape
				if Gamevars.accelerometerY > 0.05
					Gamevars.currentGravX = Settings.maxGravity
				else if Gamevars.accelerometerY < -0.05
					Gamevars.currentGravX = -Settings.maxGravity

				if Gamevars.accelerometerX < -0.05
					Gamevars.currentGravY = -Settings.maxGravity
				else if Gamevars.accelerometerX > 0.05
					Gamevars.currentGravY = Settings.maxGravity
			else
				if Gamevars.accelerometerY > 0.05
					Gamevars.currentGravY = Settings.maxGravity
				else if Gamevars.accelerometerY < -0.05
					Gamevars.currentGravY = -Settings.maxGravity

				if Gamevars.accelerometerX < -0.05
					Gamevars.currentGravX = Settings.maxGravity
				else if Gamevars.accelerometerX > 0.05
					Gamevars.currentGravX = -Settings.maxGravity

			gravity = new @b2Vec2(Gamevars.currentGravX, Gamevars.currentGravY)
			Gamevars.world.SetGravity(gravity)

			frameRate = 1/60
			velocityIterations = 10
			positionIterations = 10

			Gamevars.world.Step frameRate, velocityIterations, positionIterations

			Gamevars.world.DrawDebugData()
			Gamevars.world.ClearForces()

			Gamevars.stats.update()

		render: (delta) ->
			if @clearCanvas
				game.layer.clear()
				@clearCanvas = false

		mousedown: (event) ->

		mouseup: (event) ->

		mousemove: (event) ->

		keydown: (event) ->

		keyup: (event) ->

		touchstart: (event) ->

		touchend: (event) ->

		touchmove: (event) ->


	return box2d_game_screen