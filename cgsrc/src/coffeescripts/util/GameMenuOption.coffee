define ->
  GameMenuOption = (text, func, context) ->
    @text = text
    @func = func
    @context = context

  GameMenuOption::setClickBoundry = (x, y, width, height) ->
    @x = x
    @y = y
    @width = width
    @height = height

  GameMenuOption::checkClicked = (event) ->
    clicked = false

    #logic goes here
    console.log("Checking click for #{@text}")
    mouseX = event.x
    mouseY = event.y

    if mouseX > @x and mouseX < @x + @width and mouseY > @y and mouseY < @y + @height
      clicked = true

    if clicked
      @func.call()

  return GameMenuOption