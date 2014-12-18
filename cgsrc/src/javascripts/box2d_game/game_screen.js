define(["game", "Settings", "./Settings", "./Gamevars", "util/PusherManager", "box2d", "stats"], function(game, GlobalSettings, Settings, Gamevars, PusherManager, Box2D, Stats) {
  var box2d_game_screen;
  box2d_game_screen = {
    enter: function() {
      var SCALE, b2Body, b2BodyDef, b2CircleShape, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2PolygonShape, b2Vec2, b2World, bodyDef, debugDraw, fixDef, i;
      this.clearCanvas = true;
      debugger;
      Gamevars.stats = new Stats();
      document.body.appendChild(Gamevars.stats.domElement);
      b2Vec2 = Box2D.Common.Math.b2Vec2;
      b2BodyDef = Box2D.Dynamics.b2BodyDef;
      b2Body = Box2D.Dynamics.b2Body;
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
      b2Fixture = Box2D.Dynamics.b2Fixture;
      b2World = Box2D.Dynamics.b2World;
      b2MassData = Box2D.Collision.Shapes.b2MassData;
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
      Gamevars.world = new b2World(new b2Vec2(0, 10), true);
      SCALE = 30;
      fixDef = new b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;
      bodyDef = new b2BodyDef;
      bodyDef.type = b2Body.b2_staticBody;
      bodyDef.position.x = GlobalSettings.gameWidth / 2 / SCALE;
      bodyDef.position.y = GlobalSettings.gameHeight / SCALE;
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox((600 / SCALE) / 2, (10 / SCALE) / 2);
      Gamevars.world.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.type = b2Body.b2_dynamicBody;
      i = 0;
      while (i < 150) {
        if (Math.random() > 0.5) {
          fixDef.shape = new b2PolygonShape;
          fixDef.shape.SetAsBox(Math.random() + 0.1, Math.random() + 0.1);
        } else {
          fixDef.shape = new b2CircleShape(Math.random() + 0.1);
        }
        bodyDef.position.x = Math.random() * 25;
        bodyDef.position.y = Math.random() * 10;
        Gamevars.world.CreateBody(bodyDef).CreateFixture(fixDef);
        ++i;
      }
      debugDraw = new b2DebugDraw();
      debugDraw.SetSprite($('canvas').get(0).getContext("2d"));
      debugDraw.SetDrawScale(SCALE);
      debugDraw.SetFillAlpha(0.3);
      debugDraw.SetLineThickness(1.0);
      debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
      return Gamevars.world.SetDebugDraw(debugDraw);
    },
    ready: function() {},
    step: function(delta) {
      var frameRate, positionIterations, velocityIterations;
      frameRate = 1 / 60;
      velocityIterations = 10;
      positionIterations = 10;
      Gamevars.world.Step(frameRate, velocityIterations, positionIterations);
      Gamevars.world.DrawDebugData();
      Gamevars.world.ClearForces();
      return Gamevars.stats.update();
    },
    render: function(delta) {
      var pureAlpha;
      if (this.clearCanvas) {
        debugger;
        pureAlpha = cq.color("rgb(0, 0, 0)");
        pureAlpha.alpha(0);
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
