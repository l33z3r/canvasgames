define(["require", "jquery", "pusher", "backbone", "canvasquery", "playground", "game", "main_menu", "bird_game/game_screen", "sketch_pad_game/game_screen", "box2d_game/game_screen", "simple_chase_game/game_screen", "util/PusherManager"], function(require, $, Pusher, Backbone, cq, playground, game, main_menu, bird_game_screen, sketch_pad_game_screen, box2d_game_screen, simple_chase_game_screen, PusherManager) {
  game.main_menu = main_menu;
  game.bird_game_screen = bird_game_screen;
  game.sketch_pad_game_screen = sketch_pad_game_screen;
  game.box2d_game_screen = box2d_game_screen;
  return game.simple_chase_game_screen = simple_chase_game_screen;
});
