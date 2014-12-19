define(["game", "Settings", "./Settings", "./Gamevars", "util/PusherManager", "box2d", "stats", "./Motion"], function(game, GlobalSettings, Settings, Gamevars, PusherManager, Box2D, Stats, Motion) {
  var box2d_game_screen;
  box2d_game_screen = {
    enter: function() {
      var SCALE, bodyDef, debugDraw, fixDef, gravity, i, listener, nextBody, sleepingBodies;
      new Motion().startWatching();
      this.clearCanvas = true;
      Gamevars.stats = new Stats();
      document.body.appendChild(Gamevars.stats.domElement);
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
      this.b2ContactListener = Box2D.Dynamics.b2ContactListener;
      this.bodiesMap = {};
      gravity = new this.b2Vec2(Gamevars.currentGravX, Gamevars.currentGravY);
      sleepingBodies = false;
      Gamevars.world = new this.b2World(gravity, sleepingBodies);
      SCALE = 30;
      fixDef = new this.b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;
      bodyDef = new this.b2BodyDef;
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / 2 / SCALE;
      bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / SCALE;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox(((GlobalSettings.gameWidth * game.scale) / SCALE) / 2, (10 / SCALE) / 2);
      Gamevars.world.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.position.x = 0 / SCALE;
      bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / 2 / SCALE;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox((10 / SCALE) / 2, ((GlobalSettings.gameWidth * game.scale) / SCALE) / 2);
      Gamevars.world.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / SCALE;
      bodyDef.position.y = (GlobalSettings.gameHeight * game.scale) / 2 / SCALE;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox((10 / SCALE) / 2, ((GlobalSettings.gameWidth * game.scale) / SCALE) / 2);
      Gamevars.world.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.type = this.b2Body.b2_staticBody;
      bodyDef.position.x = (GlobalSettings.gameWidth * game.scale) / 2 / SCALE;
      bodyDef.position.y = 0 / SCALE;
      fixDef.shape = new this.b2PolygonShape;
      fixDef.shape.SetAsBox(((GlobalSettings.gameWidth * game.scale) / SCALE) / 2, (10 / SCALE) / 2);
      Gamevars.world.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.type = this.b2Body.b2_dynamicBody;
      i = 0;
      while (i < 20) {
        if (Math.random() > 0.5) {
          fixDef.shape = new this.b2PolygonShape;
          fixDef.shape.SetAsBox(Math.random() + 0.1, Math.random() + 0.1);
        } else {
          fixDef.shape = new this.b2CircleShape(Math.random() + 0.1);
        }
        bodyDef.position.x = Math.random() * 25;
        bodyDef.position.y = Math.random() * 10;
        nextBody = Gamevars.world.CreateBody(bodyDef);
        nextBody.SetUserData({
          id: i + 1
        });
        this.bodiesMap[i] = nextBody;
        nextBody.CreateFixture(fixDef);
        ++i;
      }
      debugDraw = new this.b2DebugDraw();
      debugDraw.SetSprite($('canvas').get(0).getContext("2d"));
      debugDraw.SetDrawScale(SCALE);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(this.b2DebugDraw.e_shapeBit | this.b2DebugDraw.e_jointBit);
      Gamevars.world.SetDebugDraw(debugDraw);
      listener = new this.b2ContactListener;
      listener.BeginContact = function(contact) {
        console.log(contact.GetFixtureA().GetBody().GetUserData());
      };
      listener.EndContact = function(contact) {
        console.log(contact.GetFixtureA().GetBody().GetUserData());
      };
      listener.PostSolve = function(contact, impulse) {};
      listener.PreSolve = function(contact, oldManifold) {};
      Gamevars.world.SetContactListener(listener);
      return setInterval((function(_this) {
        return function() {
          var body, randomIndex;
          randomIndex = Math.floor(Math.random() * Object.keys(_this.bodiesMap).length);
          body = _this.bodiesMap[randomIndex];
          return body.ApplyImpulse(new _this.b2Vec2(-100, -100), body.GetWorldCenter());
        };
      })(this), 5000);
    },
    ready: function() {},
    step: function(delta) {
      var frameRate, gravity, positionIterations, usingLandscape, velocityIterations;
      Gamevars.accelerometerX = (Gamevars.currentReadAccelerationX * Settings.accelFilteringFactor) + Gamevars.accelerometerX * (1.0 - Settings.accelFilteringFactor);
      Gamevars.accelerometerY = (Gamevars.currentReadAccelerationY * Settings.accelFilteringFactor) + Gamevars.accelerometerY * (1.0 - Settings.accelFilteringFactor);
      Gamevars.accelerometerZ = (Gamevars.currentReadAccelerationZ * Settings.accelFilteringFactor) + Gamevars.accelerometerZ * (1.0 - Settings.accelFilteringFactor);
      if (game.keyboard.keys["right"]) {
        Gamevars.currentGravX = Settings.maxGravity;
      } else if (game.keyboard.keys["left"]) {
        Gamevars.currentGravX = -Settings.maxGravity;
      }
      if (game.keyboard.keys["up"]) {
        Gamevars.currentGravY = -Settings.maxGravity;
      } else if (game.keyboard.keys["down"]) {
        Gamevars.currentGravY = Settings.maxGravity;
      }
      usingLandscape = false;
      if (usingLandscape) {
        if (Gamevars.accelerometerY > 0.05) {
          Gamevars.currentGravX = Settings.maxGravity;
        } else if (Gamevars.accelerometerY < -0.05) {
          Gamevars.currentGravX = -Settings.maxGravity;
        }
        if (Gamevars.accelerometerX < -0.05) {
          Gamevars.currentGravY = -Settings.maxGravity;
        } else if (Gamevars.accelerometerX > 0.05) {
          Gamevars.currentGravY = Settings.maxGravity;
        }
      } else {
        if (Gamevars.accelerometerY > 0.05) {
          Gamevars.currentGravY = Settings.maxGravity;
        } else if (Gamevars.accelerometerY < -0.05) {
          Gamevars.currentGravY = -Settings.maxGravity;
        }
        if (Gamevars.accelerometerX < -0.05) {
          Gamevars.currentGravX = Settings.maxGravity;
        } else if (Gamevars.accelerometerX > 0.05) {
          Gamevars.currentGravX = -Settings.maxGravity;
        }
      }
      gravity = new this.b2Vec2(Gamevars.currentGravX, Gamevars.currentGravY);
      Gamevars.world.SetGravity(gravity);
      frameRate = 1 / 60;
      velocityIterations = 10;
      positionIterations = 10;
      Gamevars.world.Step(frameRate, velocityIterations, positionIterations);
      Gamevars.world.DrawDebugData();
      Gamevars.world.ClearForces();
      return Gamevars.stats.update();
    },
    render: function(delta) {
      if (this.clearCanvas) {
        game.layer.clear();
        return this.clearCanvas = false;
      }
    },
    mousedown: function(event) {},
    mouseup: function(event) {},
    mousemove: function(event) {},
    keydown: function(event) {},
    keyup: function(event) {},
    touchstart: function(event) {},
    touchend: function(event) {},
    touchmove: function(event) {}
  };
  return box2d_game_screen;
});
