define(["jquery", "pusher", "backbone", "message", "Point", "Player", "canvasquery", "playground", "game", "main_menu", "game_screen"], function($, pusher, Backbone, message, Point, Player, cq, playground, game, main_menu, game_screen) {
  game.main_menu = main_menu;
  return game.game_screen = game_screen;
});
