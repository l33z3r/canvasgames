require.config({
  shim: {
    backbone: {
      deps: ["jquery"],
      exports: "Backbone"
    },
    Player: {
      deps: ["Point"]
    },
    playground: {
      deps: ["canvasquery"],
      exports: "playground"
    },
    canvasquery: {
      exports: "cq"
    },
    pusher: {
      exports: "Pusher"
    },
    box2d: {
      exports: "Box2D"
    },
    brain: {
      exports: "brain"
    },
    stats: {
      exports: "Stats"
    }
  },
  paths: {
    jquery: "bower_lib/jquery/dist/jquery",
    stats: "bower_lib/stats.js/build/stats.min",
    box2d: "bower_lib/box-2d-web/Box2dWeb-2.1.a.3.min",
    underscore: "bower_lib/underscore/underscore",
    backbone: "bower_lib/backbone/backbone",
    pusher: "bower_lib/pusher/dist/pusher.min",
    canvasquery: "lib/canvasquery",
    playground: "lib/playground",
    brain: "lib/brain"
  }
});
