define ["util/GameMenuOption"], (GameMenuOption) ->
  GameMenu = (title, items, layer, x, y, width, height) ->
    @title = title
    @items = items
    @heightPerItem = height / (@items.length + 2).toFixed(2)
    @layer = layer
    @x = x
    @y = y
    @width = width
    @height = height

  GameMenu::render = ->
    # all x will be the same
    x = @x + (@width / 2.0)
    menuItemTopSpacing = @heightPerItem / 2.0
    y = @y + menuItemTopSpacing

    #render the title first
    @layer.fillStyle("#000").font("50px Arial").textAlign("center").fillText @title, x, y

    #update y
    #title gets two slots
    y = y + (2 * @heightPerItem)

    for item in @items
      item.setClickBoundry(@x, y - menuItemTopSpacing, @width, @heightPerItem)
      @layer.fillStyle("#000").font("36px Arial").textAlign("center").fillText item.text, x, y

      #update y
      y = y + @heightPerItem

  GameMenu::handleClickEvent = (event) ->
    for item in @items
      item.checkClicked event



  return GameMenu