define(["util/GameMenuOption"], function(GameMenuOption) {
  var GameMenu;
  GameMenu = function(title, items, layer, x, y, width, height) {
    this.title = title;
    this.items = items;
    this.heightPerItem = height / (this.items.length + 2).toFixed(2);
    this.layer = layer;
    this.x = x;
    this.y = y;
    this.width = width;
    return this.height = height;
  };
  GameMenu.prototype.render = function() {
    var item, menuItemTopSpacing, x, y, _i, _len, _ref, _results;
    x = this.x + (this.width / 2.0);
    menuItemTopSpacing = this.heightPerItem / 2.0;
    y = this.y + menuItemTopSpacing;
    this.layer.fillStyle("#000").font("50px Arial").textAlign("center").fillText(this.title, x, y);
    y = y + (2 * this.heightPerItem);
    _ref = this.items;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      item.setClickBoundry(this.x, y - menuItemTopSpacing, this.width, this.heightPerItem);
      this.layer.fillStyle("#000").font("36px Arial").textAlign("center").fillText(item.text, x, y);
      _results.push(y = y + this.heightPerItem);
    }
    return _results;
  };
  GameMenu.prototype.handleClickEvent = function(event) {
    var item, _i, _len, _ref, _results;
    _ref = this.items;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      _results.push(item.checkClicked(event));
    }
    return _results;
  };
  return GameMenu;
});
