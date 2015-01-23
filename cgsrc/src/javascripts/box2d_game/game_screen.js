define(["./Player", "game", "Settings", "./Settings", "./Gamevars", "util/PusherManager", "box2d", "stats", "./Motion", "brain"], function(Player, game, GlobalSettings, Settings, Gamevars, PusherManager, Box2D, Stats, Motion, brain) {
  var box2d_game_screen;
  box2d_game_screen = {
    enter: function() {
      var gravity, sleepingBodies;
      this.player1 = new Player("Player 1");
      this.myGreenTriangle = null;
      this.clearCanvas = true;
      new Motion().startWatching();
      this.initB2Vars();
      this.bodiesMap = {};
      gravity = new this.b2Vec2(Gamevars.currentGravX, Gamevars.currentGravY);
      sleepingBodies = false;
      Gamevars.world = new this.b2World(gravity, sleepingBodies);
      this.createWalls();
      this.createBodies();
      this.setUpDebugDraw();
      this.setUpCollisionDetection();
      return this.initRandomImpulse();
    },
    ready: function() {},
    step: function(delta) {
      var frameRate, positionIterations, velocityIterations;
      if (game.keyboard.keys["right"]) {
        this.myGreenTriangle.ApplyForce(new this.b2Vec2(1, 0), this.myGreenTriangle.GetWorldCenter());
      } else if (game.keyboard.keys["left"]) {
        this.myGreenTriangle.ApplyForce(new this.b2Vec2(-1, 0), this.myGreenTriangle.GetWorldCenter());
      }
      if (game.keyboard.keys["up"]) {
        this.myGreenTriangle.ApplyForce(new this.b2Vec2(0, -1), this.myGreenTriangle.GetWorldCenter());
      } else if (game.keyboard.keys["down"]) {
        this.myGreenTriangle.ApplyForce(new this.b2Vec2(0, 1), this.myGreenTriangle.GetWorldCenter());
      }
      frameRate = 1 / 60;
      velocityIterations = 10;
      positionIterations = 10;
      Gamevars.world.Step(frameRate, velocityIterations, positionIterations);
      if (this.debugDraw) {
        Gamevars.world.DrawDebugData();
      }
      return Gamevars.world.ClearForces();
    },
    render: function(delta) {
      var body, bodyX, bodyY, point, _i, _j, _len, _len1, _ref, _ref1, _results;
      if (this.clearCanvas) {
        game.layer.clear();
        this.clearCanvas = false;
      }
      if (this.debugDraw) {
        return;
      }
      game.layer.clear(GlobalSettings.appBGColor);
      _ref = this.bodies;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        body = _ref[_i];
        game.layer.context.save();
        game.layer.context.translate((body.GetPosition().x) * Settings.scale, (body.GetPosition().y) * Settings.scale);
        game.layer.context.rotate(body.GetAngle());
        game.layer.context.translate(-(body.GetPosition().x) * Settings.scale, -(body.GetPosition().y) * Settings.scale);
        bodyX = (body.GetPosition().x - 1.6) * Settings.scale;
        bodyY = (body.GetPosition().y - 1.9) * Settings.scale;
        game.layer.drawRegion(this.player1.getImage(), this.player1.getNextSprite(), bodyX, bodyY);
        game.layer.context.restore();
        if (body === this.myGreenTriangle) {
          game.layer.context.save();
          game.layer.context.translate(body.GetPosition().x * Settings.scale, body.GetPosition().y * Settings.scale);
          game.layer.context.rotate(body.GetAngle());
          game.layer.context.translate(-(body.GetPosition().x) * Settings.scale, -(body.GetPosition().y) * Settings.scale);
          game.layer.context.fillStyle = "red";
          game.layer.context.beginPath();
          game.layer.context.moveTo((body.GetPosition().x + body.GetUserData().points[0][0]) * Settings.scale, (body.GetPosition().y + body.GetUserData().points[0][1]) * Settings.scale);
          _ref1 = body.GetUserData().points;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            point = _ref1[_j];
            game.layer.context.lineTo((point[0] + body.GetPosition().x) * Settings.scale, (point[1] + body.GetPosition().y) * Settings.scale);
          }
          game.layer.context.lineTo((body.GetPosition().x + body.GetUserData().points[0][0]) * Settings.scale, (body.GetPosition().y + body.GetUserData().points[0][1]) * Settings.scale);
          game.layer.context.closePath();
          game.layer.context.fill();
          _results.push(game.layer.context.restore());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    mousedown: function(event) {},
    mouseup: function(event) {},
    mousemove: function(event) {},
    keydown: function(event) {},
    keyup: function(event) {},
    touchstart: function(event) {},
    touchend: function(event) {},
    touchmove: function(event) {},
    initRandomImpulse: function() {
      return setInterval((function(_this) {
        return function() {
          var body, randomIndex, randomVecX, randomVecY;
          randomIndex = Math.floor(Math.random() * Object.keys(_this.bodiesMap).length);
          body = _this.bodiesMap[randomIndex];
          if (body === _this.myGreenTriangle) {
            return;
          }
          randomVecX = Math.floor(Math.random() * 10) - 5;
          randomVecY = Math.floor(Math.random() * 10) - 5;
          return body.ApplyImpulse(new _this.b2Vec2(randomVecX, randomVecY), body.GetWorldCenter());
        };
      })(this), 1000);
    },
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
    createBodies: function() {
      var bodyDef, bodyID, fixDef, nextBody, num, shapeDef, shapeVecs, userData, vec, vertex, _i, _j, _len, _ref, _results;
      fixDef = new this.b2FixtureDef;
      fixDef.density = 0.2;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_dynamicBody;
      bodyDef.bullet = true;
      shapeDef = [[0, 0], [1, 0], [0, 1]];
      bodyID = 0;
      this.bodies = [];
      this.numBodies = 30;
      _results = [];
      for (num = _i = 1, _ref = this.numBodies; 1 <= _ref ? _i <= _ref : _i >= _ref; num = 1 <= _ref ? ++_i : --_i) {
        fixDef.shape = new this.b2PolygonShape;
        shapeVecs = [];
        for (_j = 0, _len = shapeDef.length; _j < _len; _j++) {
          vertex = shapeDef[_j];
          vec = new this.b2Vec2();
          vec.Set(vertex[0], vertex[1]);
          shapeVecs.push(vec);
        }
        fixDef.shape.SetAsArray(shapeVecs, shapeVecs.length);
        bodyDef.position.x = Math.random() * (1200 / game.scale / Settings.scale);
        bodyDef.position.y = Math.random() * (700 / game.scale / Settings.scale);
        nextBody = Gamevars.world.CreateBody(bodyDef);
        this.bodies.push(nextBody);
        userData = {
          id: bodyID + 1,
          points: shapeDef
        };
        if (bodyID === 0) {
          userData["myGreenTriangle"] = true;
          this.myGreenTriangle = nextBody;
        }
        nextBody.SetUserData(userData);
        this.bodiesMap[bodyID] = nextBody;
        bodyID++;
        _results.push(nextBody.CreateFixture(fixDef));
      }
      return _results;
    },
    createWalls: function() {
      var bodyDef, fixDef, paintCoordsHeight, paintCoordsWidth, paintCoordsX, paintCoordsY, paintWallThickness, wallBody, wallThickness;
      this.walls = [];
      fixDef = new this.b2FixtureDef;
      fixDef.density = 99;
      fixDef.friction = 99;
      fixDef.restitution = 0.5;
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.bullet = true;
      bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / 2 / Settings.scale;
      bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / Settings.scale;
      fixDef.shape = new this.b2PolygonShape;
      wallThickness = 100;
      paintWallThickness = 10;
      fixDef.shape.SetAsBox(((GlobalSettings.gameWidth * game.scale) / Settings.scale) / 2, (wallThickness / Settings.scale) / 2);
      wallBody = Gamevars.world.CreateBody(bodyDef);
      paintCoordsX = 0;
      paintCoordsY = (GlobalSettings.gameHeight * game.scale) - wallThickness;
      paintCoordsWidth = GlobalSettings.gameWidth * game.scale;
      paintCoordsHeight = paintWallThickness;
      wallBody.SetUserData({
        id: "bottom_wall",
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]
      });
      wallBody.CreateFixture(fixDef);
      this.walls.push(wallBody);
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.bullet = true;
      bodyDef.position.x = 0 / Settings.scale;
      bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / 2 / Settings.scale;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox((wallThickness / Settings.scale) / 2, ((GlobalSettings.gameHeight * game.scale) / Settings.scale) / 2);
      wallBody = Gamevars.world.CreateBody(bodyDef);
      paintCoordsX = 0 - (wallThickness / 2);
      paintCoordsY = 0;
      paintCoordsWidth = wallThickness;
      paintCoordsHeight = GlobalSettings.gameHeight * game.scale;
      wallBody.SetUserData({
        id: "left_wall",
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]
      });
      wallBody.CreateFixture(fixDef);
      this.walls.push(wallBody);
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.bullet = true;
      bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / Settings.scale;
      bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / 2 / Settings.scale;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox((wallThickness / Settings.scale) / 2, ((GlobalSettings.gameHeight * game.scale) / Settings.scale) / 2);
      wallBody = Gamevars.world.CreateBody(bodyDef);
      paintCoordsX = (GlobalSettings.gameWidth * game.scale) - (wallThickness / 2);
      paintCoordsY = 0;
      paintCoordsWidth = wallThickness;
      paintCoordsHeight = GlobalSettings.gameHeight * game.scale;
      wallBody.SetUserData({
        id: "right_wall",
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]
      });
      wallBody.CreateFixture(fixDef);
      this.walls.push(wallBody);
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.bullet = true;
      bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / 2 / Settings.scale;
      bodyDef.position.y = 0 / Settings.scale;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox(((GlobalSettings.gameWidth * game.scale) / Settings.scale) / 2, (wallThickness / Settings.scale) / 2);
      wallBody = Gamevars.world.CreateBody(bodyDef);
      paintCoordsX = 0 - (wallThickness / 2);
      paintCoordsY = 0 - (wallThickness / 2);
      paintCoordsWidth = GlobalSettings.gameWidth * game.scale;
      paintCoordsHeight = wallThickness;
      wallBody.SetUserData({
        id: "top_wall",
        paintCoords: [paintCoordsX, paintCoordsY, paintCoordsWidth, paintCoordsHeight]
      });
      wallBody.CreateFixture(fixDef);
      return this.walls.push(wallBody);
    },
    setUpCollisionDetection: function() {
      var listener;
      listener = new this.b2ContactListener;
      listener.BeginContact = function(contact) {};
      listener.EndContact = function(contact) {};
      listener.PostSolve = function(contact, impulse) {
        var bodyAId, bodyBId, damage;
        bodyAId = contact.GetFixtureA().GetBody().GetUserData().id;
        bodyBId = contact.GetFixtureB().GetBody().GetUserData().id;
        return damage = impulse.normalImpulses[0];
      };
      listener.PreSolve = function(contact, oldManifold) {};
      return Gamevars.world.SetContactListener(listener);
    },
    setUpDebugDraw: function() {
      var debugDraw;
      this.debugDraw = false;
      if (this.debugDraw) {
        debugDraw = new this.b2DebugDraw();
        debugDraw.SetSprite($('canvas').get(0).getContext("2d"));
        debugDraw.SetDrawScale(Settings.scale);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(this.b2DebugDraw.e_shapeBit | this.b2DebugDraw.e_jointBit);
        return Gamevars.world.SetDebugDraw(debugDraw);
      }
    }
  };
  return box2d_game_screen;
});
