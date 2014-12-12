define(function() {
  var GameMenuOption;
  GameMenuOption = function(text, func, context) {
    this.text = text;
    this.func = func;
    return this.context = context;
  };
  GameMenuOption.prototype.setClickBoundry = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    return this.height = height;
  };
  GameMenuOption.prototype.checkClicked = function(event) {
    var clicked, mouseX, mouseY;
    clicked = false;
    console.log("Checking click for " + this.text);
    mouseX = event.x;
    mouseY = event.y;
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
      clicked = true;
    }
    if (clicked) {
      return this.func.call();
    }
  };
  return GameMenuOption;
});
