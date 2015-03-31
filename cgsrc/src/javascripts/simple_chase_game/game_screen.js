define(["game", "Settings", "./Settings", "util/PusherManager", "box2d"], function(game, GlobalSettings, Settings, PusherManager, Box2D) {
  var box2d_game_screen;
  box2d_game_screen = {
    enter: function() {
      var gravity, sleepingBodies;
      this.initB2Vars();
      this.bodiesMap = {};
      gravity = new this.b2Vec2(0, 0);
      sleepingBodies = false;
      this.world = new this.b2World(gravity, sleepingBodies);
      this.createWalls();
      this.myGreenShip = this.createBody("myGreenShip", "green");
      return this.theRedShip = this.createBody("theRedShip", "red");
    },
    ready: function() {},
    step: function(delta) {
      var frameRate, positionIterations, speedVelocity, turningVelocity, velocityIterations;
      turningVelocity = 2;
      speedVelocity = 5;
      if (game.keyboard.keys["right"]) {
        this.myGreenShip.ApplyForce(this.myGreenShip.GetWorldVector(new this.b2Vec2(-turningVelocity, 0)), this.myGreenShip.GetWorldPoint(new this.b2Vec2(0, 1)));
      } else if (game.keyboard.keys["left"]) {
        this.myGreenShip.ApplyForce(this.myGreenShip.GetWorldVector(new this.b2Vec2(turningVelocity, 0)), this.myGreenShip.GetWorldPoint(new this.b2Vec2(0, 1)));
      }
      if (game.keyboard.keys["up"]) {
        this.myGreenShip.ApplyForce(this.myGreenShip.GetWorldVector(new this.b2Vec2(0, -speedVelocity)), this.myGreenShip.GetWorldCenter());
      } else if (game.keyboard.keys["down"]) {
        this.myGreenShip.ApplyForce(this.myGreenShip.GetWorldVector(new this.b2Vec2(0, speedVelocity)), this.myGreenShip.GetWorldCenter());
      }
      frameRate = 1 / 60;
      velocityIterations = 10;
      positionIterations = 10;
      this.world.Step(frameRate, velocityIterations, positionIterations);
      return this.world.ClearForces();
    },
    render: function(delta) {
      var paintCoords, wall, _i, _len, _ref, _results;
      game.layer.clear(Settings.appBGColor);
      this.drawBody(this.myGreenShip);
      this.drawBody(this.theRedShip);
      if (this.walls != null) {
        _ref = this.walls;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          wall = _ref[_i];
          game.layer.context.fillStyle = "white";
          game.layer.context.beginPath();
          paintCoords = wall.GetUserData().paintCoords;
          game.layer.context.rect(paintCoords[0], paintCoords[1], paintCoords[2], paintCoords[3]);
          _results.push(game.layer.context.fill());
        }
        return _results;
      }
    },
    drawBody: function(body) {
      var point, _i, _len, _ref;
      game.layer.context.save();
      game.layer.context.translate(body.GetPosition().x * Settings.scale, body.GetPosition().y * Settings.scale);
      game.layer.context.rotate(body.GetAngle());
      game.layer.context.translate(-(body.GetPosition().x) * Settings.scale, -(body.GetPosition().y) * Settings.scale);
      game.layer.context.fillStyle = body.GetUserData().color;
      game.layer.context.beginPath();
      game.layer.context.moveTo((body.GetPosition().x + body.GetUserData().points[0][0]) * Settings.scale, (body.GetPosition().y + body.GetUserData().points[0][1]) * Settings.scale);
      _ref = body.GetUserData().points;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        game.layer.context.lineTo((point[0] + body.GetPosition().x) * Settings.scale, (point[1] + body.GetPosition().y) * Settings.scale);
      }
      game.layer.context.lineTo((body.GetPosition().x + body.GetUserData().points[0][0]) * Settings.scale, (body.GetPosition().y + body.GetUserData().points[0][1]) * Settings.scale);
      game.layer.context.closePath();
      game.layer.context.fill();
      return game.layer.context.restore();
    },
    mousedown: function(event) {},
    mouseup: function(event) {},
    mousemove: function(event) {},
    keydown: function(event) {},
    keyup: function(event) {},
    touchstart: function(event) {},
    touchend: function(event) {},
    touchmove: function(event) {},
    initB2Vars: function() {
      this.b2Vec2 = Box2D.Common.Math.b2Vec2;
      this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
      this.b2Body = Box2D.Dynamics.b2Body;
      this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
      this.b2Fixture = Box2D.Dynamics.b2Fixture;
      this.b2World = Box2D.Dynamics.b2World;
      this.b2MassData = Box2D.Collision.Shapes.b2MassData;
      this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
      this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
      this.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
      return this.b2ContactListener = Box2D.Dynamics.b2ContactListener;
    },
    createBody: function(bodyID, color) {
      var bodyDef, fixDef, nextBody, shapeDef, shapeVecs, userData, vec, vertex, _i, _len;
      fixDef = new this.b2FixtureDef;
      fixDef.density = 0.2;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_dynamicBody;
      bodyDef.bullet = true;
      shapeDef = [[0, -3], [1, 1], [-1, 1]];
      fixDef.shape = new this.b2PolygonShape;
      shapeVecs = [];
      for (_i = 0, _len = shapeDef.length; _i < _len; _i++) {
        vertex = shapeDef[_i];
        vec = new this.b2Vec2();
        vec.Set(vertex[0], vertex[1]);
        shapeVecs.push(vec);
      }
      fixDef.shape.SetAsArray(shapeVecs, shapeVecs.length);
      bodyDef.position.x = Math.random() * (1600 / Settings.scale);
      bodyDef.position.y = Math.random() * (900 / Settings.scale);
      nextBody = this.world.CreateBody(bodyDef);
      userData = {
        id: bodyID,
        color: color,
        points: shapeDef
      };
      nextBody.SetUserData(userData);
      nextBody.CreateFixture(fixDef);
      return nextBody;
    },
    createWalls: function() {
      var bodyDef, fixDef, paintCoordsHeight, paintCoordsWidth, paintCoordsX, paintCoordsY, wallBody, wallThickness;
      this.walls = [];
      fixDef = new this.b2FixtureDef;
      fixDef.density = 99;
      fixDef.friction = 99;
      fixDef.restitution = 0.5;
      wallThickness = 100;
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.bullet = true;
      bodyDef.position.x = 0;
      bodyDef.position.y = GlobalSettings.gameHeight / 2 / Settings.scale;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox((wallThickness / Settings.scale) / 2, (GlobalSettings.gameHeight / Settings.scale) / 2);
      wallBody = this.world.CreateBody(bodyDef);
      paintCoordsX = 0 - (wallThickness / 2);
      paintCoordsY = 0;
      paintCoordsWidth = wallThickness;
      paintCoordsHeight = GlobalSettings.gameHeight;
      wallBody.SetUserData({
        id: "left_wall",
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]
      });
      wallBody.CreateFixture(fixDef);
      this.walls.push(wallBody);
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.bullet = true;
      bodyDef.position.x = GlobalSettings.gameWidth / Settings.scale;
      bodyDef.position.y = GlobalSettings.gameHeight / 2 / Settings.scale;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox((wallThickness / Settings.scale) / 2, (GlobalSettings.gameHeight / Settings.scale) / 2);
      wallBody = this.world.CreateBody(bodyDef);
      paintCoordsX = GlobalSettings.gameWidth - (wallThickness / 2);
      paintCoordsY = 0;
      paintCoordsWidth = wallThickness;
      paintCoordsHeight = GlobalSettings.gameHeight;
      wallBody.SetUserData({
        id: "right_wall",
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]
      });
      wallBody.CreateFixture(fixDef);
      this.walls.push(wallBody);
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.bullet = true;
      bodyDef.position.x = GlobalSettings.gameWidth / 2 / Settings.scale;
      bodyDef.position.y = 0;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox((GlobalSettings.gameWidth / Settings.scale) / 2, (wallThickness / Settings.scale) / 2);
      wallBody = this.world.CreateBody(bodyDef);
      paintCoordsX = 0 - (wallThickness / 2);
      paintCoordsY = 0 - (wallThickness / 2);
      paintCoordsWidth = GlobalSettings.gameWidth;
      paintCoordsHeight = wallThickness;
      wallBody.SetUserData({
        id: "top_wall",
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]
      });
      wallBody.CreateFixture(fixDef);
      this.walls.push(wallBody);
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.bullet = true;
      bodyDef.position.x = GlobalSettings.gameWidth / 2 / Settings.scale;
      bodyDef.position.y = GlobalSettings.gameHeight / Settings.scale;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox((GlobalSettings.gameWidth / Settings.scale) / 2, (wallThickness / Settings.scale) / 2);
      wallBody = this.world.CreateBody(bodyDef);
      paintCoordsX = 0 - (wallThickness / 2);
      paintCoordsY = GlobalSettings.gameHeight - (wallThickness / 2);
      paintCoordsWidth = GlobalSettings.gameWidth;
      paintCoordsHeight = wallThickness;
      wallBody.SetUserData({
        id: "bottom_wall",
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]
      });
      wallBody.CreateFixture(fixDef);
      return this.walls.push(wallBody);
    }
  };
  return box2d_game_screen;
});
