define ["game", "Settings", "./Settings", "util/PusherManager", "box2d"]
, (game, GlobalSettings, Settings, PusherManager, Box2D) ->
  box2d_game_screen =
    enter: ->
      @initB2Vars()

      @bodiesMap = {}

      gravity = new @b2Vec2(0, 0)
      sleepingBodies = false
      @world = new @b2World(gravity, sleepingBodies)

      @createWalls()

      @myGreenShip = @createBody("myGreenShip", "green")
      @theRedShip = @createBody("theRedShip", "red")

    ready: ->

    step: (delta) ->
      distanceBetweenShips = @b2Math.Distance(@myGreenShip.GetPosition(), @theRedShip.GetPosition())
      ljForce = @getLJPotential(distanceBetweenShips / Settings.scale)
      console.log("LJForce: " + ljForce)

      turningVelocity = 10
      speedVelocity = 5

      #there are two methods of steering here, the commented out one should be used for LJPotential
      if game.keyboard.keys["right"]
        @myGreenShip.ApplyTorque(turningVelocity)
        #@myGreenShip.ApplyForce(@myGreenShip.GetWorldVector(new @b2Vec2(-turningVelocity, 0)),  @myGreenShip.GetWorldPoint(new @b2Vec2(0, 1)))
      else if game.keyboard.keys["left"]
        @myGreenShip.ApplyTorque(-turningVelocity)
        @myGreenShip.ApplyForce(@myGreenShip.GetWorldVector(new @b2Vec2(turningVelocity, 0)), @myGreenShip.GetWorldPoint(new @b2Vec2(0, 1)))

      if game.keyboard.keys["up"]
        @myGreenShip.ApplyForce(@myGreenShip.GetWorldVector(new @b2Vec2(0, -speedVelocity)),  @myGreenShip.GetWorldCenter())
      else if game.keyboard.keys["down"]
        @myGreenShip.ApplyForce(@myGreenShip.GetWorldVector(new @b2Vec2(0, speedVelocity)), @myGreenShip.GetWorldCenter())

      frameRate = 1/60
      velocityIterations = 10
      positionIterations = 10

      @world.Step frameRate, velocityIterations, positionIterations
      @world.ClearForces()

    render: (delta) ->
      game.layer.clear Settings.appBGColor

      @drawBody(@myGreenShip)
      @drawBody(@theRedShip)

      if @walls?
        for wall in @walls
         game.layer.context.fillStyle = "white"

         game.layer.context.beginPath();

         paintCoords = wall.GetUserData().paintCoords

         game.layer.context.rect(paintCoords[0], paintCoords[1], paintCoords[2], paintCoords[3])

         game.layer.context.fill()

    drawBody: (body) ->
      game.layer.context.save()

      game.layer.context.translate(body.GetPosition().x * Settings.scale, body.GetPosition().y * Settings.scale)
      game.layer.context.rotate(body.GetAngle())
      game.layer.context.translate(-(body.GetPosition().x) * Settings.scale, -(body.GetPosition().y) * Settings.scale)

      game.layer.context.fillStyle = body.GetUserData().color

      game.layer.context.beginPath();
      game.layer.context.moveTo((body.GetPosition().x + body.GetUserData().points[0][0]) * Settings.scale, (body.GetPosition().y + body.GetUserData().points[0][1]) * Settings.scale);

      for point in body.GetUserData().points
        game.layer.context.lineTo((point[0] + body.GetPosition().x) * Settings.scale, (point[1] + body.GetPosition().y) * Settings.scale)

      game.layer.context.lineTo((body.GetPosition().x + body.GetUserData().points[0][0]) * Settings.scale, (body.GetPosition().y + body.GetUserData().points[0][1]) * Settings.scale);
      game.layer.context.closePath()
      game.layer.context.fill()

      game.layer.context.restore()

    mousedown: (event) ->

    mouseup: (event) ->

    mousemove: (event) ->

    keydown: (event) ->

    keyup: (event) ->

    touchstart: (event) ->

    touchend: (event) ->

    touchmove: (event) ->

    initB2Vars: ->
      @b2Math = Box2D.Common.Math.b2Math
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

    createBody: (bodyID, color) ->
      fixDef = new @b2FixtureDef
      fixDef.density = 0.2
      fixDef.friction = 0.5
      fixDef.restitution = 0.2

      bodyDef = new @b2BodyDef
      bodyDef.type = @b2Body.b2_dynamicBody
      bodyDef.bullet = true

      shapeDef = [[0, -3], [1, 1], [-1, 1]]

      fixDef.shape = new @b2PolygonShape

      shapeVecs = []

      for vertex in shapeDef
        vec = new @b2Vec2()
        vec.Set(vertex[0], vertex[1])
        shapeVecs.push(vec)

      fixDef.shape.SetAsArray(shapeVecs, shapeVecs.length)

      bodyDef.position.x = Math.random() * (1600 / Settings.scale)
      bodyDef.position.y = Math.random() * (900 / Settings.scale)

      nextBody = @world.CreateBody(bodyDef)

      userData =
        id: bodyID
        color: color
        points: shapeDef

      nextBody.SetUserData userData

      nextBody.CreateFixture fixDef

      nextBody

    createWalls: ->
      @walls = []

      fixDef = new @b2FixtureDef
      fixDef.density = 99
      fixDef.friction = 99
      fixDef.restitution = 0.5

      wallThickness = 100

      #create left ground
      bodyDef = new @b2BodyDef
      bodyDef.type = @b2Body.b2_staticBody
      bodyDef.bullet = true

      # positions the center of the object (not upper left!)
      bodyDef.position.x = 0
      bodyDef.position.y = (GlobalSettings.gameHeight) / 2 / Settings.scale
      fixDef.shape = new @b2PolygonShape

      # half width, half height. eg actual height here is 1 unit
      fixDef.shape.SetAsBox (wallThickness / Settings.scale) / 2, ((GlobalSettings.gameHeight) / Settings.scale) / 2
      wallBody = @world.CreateBody(bodyDef)

      paintCoordsX = 0 - (wallThickness / 2)
      paintCoordsY = 0
      paintCoordsWidth = wallThickness
      paintCoordsHeight = GlobalSettings.gameHeight

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
      bodyDef.position.x = (GlobalSettings.gameWidth) / Settings.scale
      bodyDef.position.y = (GlobalSettings.gameHeight) / 2 / Settings.scale
      fixDef.shape = new @b2PolygonShape

      # half width, half height. eg actual height here is 1 unit
      fixDef.shape.SetAsBox (wallThickness / Settings.scale) / 2, ((GlobalSettings.gameHeight) / Settings.scale) / 2
      wallBody = @world.CreateBody(bodyDef)

      paintCoordsX = (GlobalSettings.gameWidth) - (wallThickness / 2)
      paintCoordsY = 0
      paintCoordsWidth = wallThickness
      paintCoordsHeight = GlobalSettings.gameHeight

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
      bodyDef.position.x = (GlobalSettings.gameWidth) / 2 / Settings.scale
      bodyDef.position.y = 0
      fixDef.shape = new @b2PolygonShape

      # half width, half height. eg actual height here is 1 unit
      fixDef.shape.SetAsBox ((GlobalSettings.gameWidth) / Settings.scale) / 2, (wallThickness / Settings.scale) / 2
      wallBody = @world.CreateBody(bodyDef)

      paintCoordsX = 0 - (wallThickness / 2)
      paintCoordsY = 0 - (wallThickness / 2)
      paintCoordsWidth = GlobalSettings.gameWidth
      paintCoordsHeight = wallThickness

      wallBody.SetUserData
        id: "top_wall"
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]

      wallBody.CreateFixture fixDef

      @walls.push(wallBody)

      #create bottom ground
      bodyDef = new @b2BodyDef
      bodyDef.type = @b2Body.b2_staticBody
      bodyDef.bullet = true

      # positions the center of the object (not upper left!)
      bodyDef.position.x = (GlobalSettings.gameWidth) / 2 / Settings.scale
      bodyDef.position.y = GlobalSettings.gameHeight / Settings.scale
      fixDef.shape = new @b2PolygonShape

      # half width, half height. eg actual height here is 1 unit
      fixDef.shape.SetAsBox ((GlobalSettings.gameWidth) / Settings.scale) / 2, (wallThickness / Settings.scale) / 2
      wallBody = @world.CreateBody(bodyDef)

      paintCoordsX = 0 - (wallThickness / 2)
      paintCoordsY = GlobalSettings.gameHeight - (wallThickness / 2)
      paintCoordsWidth = GlobalSettings.gameWidth
      paintCoordsHeight = wallThickness

      wallBody.SetUserData
        id: "bottom_wall"
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]

      wallBody.CreateFixture fixDef

      @walls.push(wallBody)

    getLJPotential: (distanceBetweenObjects) ->
      #attraction force
      attractionForce = 2000
      attractionAttenuation = 2

      #repulsion force
      repulsionForce = 4000
      repulsionAttenuation = 3

      force = -attractionForce/Math.pow(distanceBetweenObjects, attractionAttenuation) + repulsionForce/Math.pow(distanceBetweenObjects, repulsionAttenuation)

      force

  return box2d_game_screen