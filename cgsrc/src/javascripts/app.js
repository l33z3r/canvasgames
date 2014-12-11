define(["require", "jquery", "pusher", "backbone", "canvasquery", "playground", "game", "main_menu", "bird_game/game_screen", "util/PusherManager"], function(require, $, Pusher, Backbone, cq, playground, game, main_menu, bird_game_screen, PusherManager) {
  game.main_menu = main_menu;
  return game.bird_game_screen = bird_game_screen;
});
