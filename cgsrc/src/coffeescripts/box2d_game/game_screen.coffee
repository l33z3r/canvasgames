define ["./Player", "game", "Settings", "./Settings", "./Gamevars", "util/PusherManager", "box2d", "stats", "./Motion", "brain"]
, (Player, game, GlobalSettings, Settings, Gamevars, PusherManager, Box2D, Stats, Motion, brain) ->
	box2d_game_screen =
		enter: ->
			@player1 = new Player("Player 1")

			@myGreenShip = null
			@clearCanvas = true

			new Motion().startWatching()

			@initB2Vars()

			@bodiesMap = {}

			gravity = new @b2Vec2(Gamevars.currentGravX, Gamevars.currentGravY)
			sleepingBodies = false
			Gamevars.world = new @b2World(gravity, sleepingBodies)

			@createWalls()
			@createBodies()
			@setUpDebugDraw()
			@setUpCollisionDetection()
			@initRandomImpulse()

		ready: ->



		step: (delta) ->
			if game.keyboard.keys["right"]
				@myGreenShip.ApplyForce(new @b2Vec2(1, 0),	@myGreenShip.GetWorldCenter())
			else if game.keyboard.keys["left"]
				@myGreenShip.ApplyForce(new @b2Vec2(-1, 0),	@myGreenShip.GetWorldCenter())

			if game.keyboard.keys["up"]
				@myGreenShip.ApplyForce(new @b2Vec2(0, -1),	@myGreenShip.GetWorldCenter())
			else if game.keyboard.keys["down"]
				@myGreenShip.ApplyForce(new @b2Vec2(0, 1),	@myGreenShip.GetWorldCenter())

			frameRate = 1/60
			velocityIterations = 10
			positionIterations = 10

			Gamevars.world.Step frameRate, velocityIterations, positionIterations

			if @debugDraw
				Gamevars.world.DrawDebugData()

			Gamevars.world.ClearForces()

		render: (delta) ->
			if @clearCanvas
				game.layer.clear()
				@clearCanvas = false

			if @debugDraw
				return

			game.layer.clear GlobalSettings.appBGColor

			for body in @bodies
				game.layer.context.save()

				game.layer.context.translate((body.GetPosition().x) * Settings.scale, (body.GetPosition().y) * Settings.scale)
				game.layer.context.rotate(body.GetAngle())
				game.layer.context.translate(-(body.GetPosition().x) * Settings.scale, -(body.GetPosition().y) * Settings.scale)

				bodyX = (body.GetPosition().x - 1.6) * Settings.scale
				bodyY = (body.GetPosition().y - 1.9) * Settings.scale

				game.layer.drawRegion @player1.getImage(), @player1.getNextSprite(), bodyX, bodyY

				game.layer.context.restore()

				if body is @myGreenShip
					game.layer.context.save()

					game.layer.context.translate(body.GetPosition().x * Settings.scale, body.GetPosition().y * Settings.scale)
					game.layer.context.rotate(body.GetAngle())
					game.layer.context.translate(-(body.GetPosition().x) * Settings.scale, -(body.GetPosition().y) * Settings.scale)

					game.layer.context.fillStyle = "red"

					game.layer.context.beginPath();
					game.layer.context.moveTo((body.GetPosition().x + body.GetUserData().points[0][0]) * Settings.scale, (body.GetPosition().y + body.GetUserData().points[0][1]) * Settings.scale);

					for point in body.GetUserData().points
						game.layer.context.lineTo((point[0] + body.GetPosition().x) * Settings.scale, (point[1] + body.GetPosition().y) * Settings.scale)

					game.layer.context.lineTo((body.GetPosition().x + body.GetUserData().points[0][0]) * Settings.scale, (body.GetPosition().y + body.GetUserData().points[0][1]) * Settings.scale);
					game.layer.context.closePath()
					game.layer.context.fill()

					game.layer.context.restore()


#			for wall in @walls
#				game.layer.context.fillStyle = "black"
#
#				game.layer.context.beginPath();
#
#				paintCoords = wall.GetUserData().paintCoords
#
#				game.layer.context.rect(paintCoords[0], paintCoords[1], paintCoords[2], paintCoords[3])
#
#				game.layer.context.fill()

		mousedown: (event) ->

		mouseup: (event) ->

		mousemove: (event) ->

		keydown: (event) ->

		keyup: (event) ->

		touchstart: (event) ->

		touchend: (event) ->

		touchmove: (event) ->

		initRandomImpulse: ->
			setInterval =>
				randomIndex = Math.floor(Math.random() * Object.keys(@bodiesMap).length)
				body = @bodiesMap[randomIndex]

				if body is @myGreenShip
					return

				randomVecX = Math.floor(Math.random() * 10) - 5
				randomVecY = Math.floor(Math.random() * 10) - 5
				body.ApplyImpulse(new @b2Vec2(randomVecX, randomVecY),	body.GetWorldCenter())
			, 1000

		initB2Vars: ->
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
			@b2ContactListener = Box2D.Dynamics.b2ContactListener

		createBodies: ->
			fixDef = new @b2FixtureDef
			fixDef.density = 0.2
			fixDef.friction = 0.5
			fixDef.restitution = 0.2

			bodyDef = new @b2BodyDef
			bodyDef.type = @b2Body.b2_dynamicBody
			bodyDef.bullet = true

			shapeDef = [[0, 0], [1, 0], [0, 1]]

			bodyID = 0
			@bodies = []

			@numBodies = 30

			for num in [1..@numBodies]
				fixDef.shape = new @b2PolygonShape

				shapeVecs = []

				for vertex in shapeDef
					vec = new @b2Vec2()
					vec.Set(vertex[0], vertex[1])
					shapeVecs.push(vec)

				fixDef.shape.SetAsArray(shapeVecs, shapeVecs.length)

				bodyDef.position.x = Math.random() * (1200 / game.scale / Settings.scale)
				bodyDef.position.y = Math.random() * (700 / game.scale / Settings.scale)

				nextBody = Gamevars.world.CreateBody(bodyDef)

				@bodies.push(nextBody)

				userData =
					id: bodyID + 1
					points: shapeDef

				if bodyID is 0
					userData["myGreenShip"] = true
					@myGreenShip = nextBody

				nextBody.SetUserData userData

				@bodiesMap[bodyID] = nextBody
				bodyID++

				nextBody.CreateFixture fixDef

		createWalls: ->
			@walls = []

			fixDef = new @b2FixtureDef
			fixDef.density = 99
			fixDef.friction = 99
			fixDef.restitution = 0.5

			#create bottom ground
			bodyDef = new @b2BodyDef
			bodyDef.type = @b2Body.b2_staticBody
			bodyDef.bullet = true

			# positions the center of the object (not upper left!)
			bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / 2 / Settings.scale
			bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / Settings.scale
			fixDef.shape = new @b2PolygonShape

			wallThickness = 100
			paintWallThickness = 10

			# half width, half height. eg actual height here is 1 unit
			fixDef.shape.SetAsBox ((GlobalSettings.gameWidth * game.scale) / Settings.scale) / 2, (wallThickness / Settings.scale) / 2
			wallBody = Gamevars.world.CreateBody(bodyDef)

			paintCoordsX = 0
			paintCoordsY = (GlobalSettings.gameHeight * game.scale) - wallThickness
			paintCoordsWidth = GlobalSettings.gameWidth * game.scale
			paintCoordsHeight = paintWallThickness

			wallBody.SetUserData
				id: "bottom_wall"
				paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]

			wallBody.CreateFixture fixDef

			@walls.push(wallBody)

			#create left ground
			bodyDef = new @b2BodyDef
			bodyDef.type = @b2Body.b2_staticBody
			bodyDef.bullet = true

			# positions the center of the object (not upper left!)
			bodyDef.position.x = 0 / Settings.scale
			bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / 2 / Settings.scale
			fixDef.shape = new @b2PolygonShape

			# half width, half height. eg actual height here is 1 unit
			fixDef.shape.SetAsBox (wallThickness / Settings.scale) / 2, ((GlobalSettings.gameHeight * game.scale) / Settings.scale) / 2
			wallBody = Gamevars.world.CreateBody(bodyDef)

			paintCoordsX = 0 - (wallThickness / 2)
			paintCoordsY = 0
			paintCoordsWidth = wallThickness
			paintCoordsHeight = GlobalSettings.gameHeight * game.scale

			wallBody.SetUserData
				id: "left_wall"
				paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]

			wallBody.CreateFixture fixDef

			@walls.push(wallBody)

			#create right ground
			bodyDef = new @b2BodyDef
			bodyDef.type = @b2Body.b2_staticBody
			bodyDef.bullet = true

			# positions the center of the object (not upper left!)
			bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / Settings.scale
			bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / 2 / Settings.scale
			fixDef.shape = new @b2PolygonShape

			# half width, half height. eg actual height here is 1 unit
			fixDef.shape.SetAsBox (wallThickness / Settings.scale) / 2, ((GlobalSettings.gameHeight * game.scale) / Settings.scale) / 2
			wallBody = Gamevars.world.CreateBody(bodyDef)

			paintCoordsX = (GlobalSettings.gameWidth * game.scale) - (wallThickness / 2)
			paintCoordsY = 0
			paintCoordsWidth = wallThickness
			paintCoordsHeight = GlobalSettings.gameHeight * game.scale

			wallBody.SetUserData
				id: "right_wall"
				paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]

			wallBody.CreateFixture fixDef

			@walls.push(wallBody)

			#create top ground
			bodyDef = new @b2BodyDef
			bodyDef.type = @b2Body.b2_staticBody
			bodyDef.bullet = true

			# positions the center of the object (not upper left!)
			bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / 2 / Settings.scale
			bodyDef.position.y = 0 / Settings.scale
			fixDef.shape = new @b2PolygonShape

			# half width, half height. eg actual height here is 1 unit
			fixDef.shape.SetAsBox ((GlobalSettings.gameWidth * game.scale) / Settings.scale) / 2, (wallThickness / Settings.scale) / 2
			wallBody = Gamevars.world.CreateBody(bodyDef)

			paintCoordsX = 0 - (wallThickness / 2)
			paintCoordsY = 0 - (wallThickness / 2)
			paintCoordsWidth = GlobalSettings.gameWidth * game.scale
			paintCoordsHeight = wallThickness

			wallBody.SetUserData
				id: "top_wall"
				paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]

			wallBody.CreateFixture fixDef

			@walls.push(wallBody)

		setUpCollisionDetection: ->
			listener = new @b2ContactListener
			listener.BeginContact = (contact) ->

			listener.EndContact = (contact) ->

			listener.PostSolve = (contact, impulse) ->
				bodyAId = contact.GetFixtureA().GetBody().GetUserData().id
				bodyBId = contact.GetFixtureB().GetBody().GetUserData().id
				damage = impulse.normalImpulses[0]

#				if damage > 0
#					console.log "#{bodyAId} collided with #{bodyBId} with impulse #{damage}"

			listener.PreSolve = (contact, oldManifold) ->

			Gamevars.world.SetContactListener listener

		setUpDebugDraw: ->
			@debugDraw = false

			if @debugDraw
				debugDraw = new @b2DebugDraw()
				debugDraw.SetSprite $('canvas').get(0).getContext("2d")
				debugDraw.SetDrawScale Settings.scale
				debugDraw.SetFillAlpha 0.3
				debugDraw.SetLineThickness 1.0
				debugDraw.SetFlags @b2DebugDraw.e_shapeBit | @b2DebugDraw.e_jointBit
				Gamevars.world.SetDebugDraw debugDraw

	return box2d_game_screen