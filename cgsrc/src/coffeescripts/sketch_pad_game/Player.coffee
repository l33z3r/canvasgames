define ["Point", "../game"], (Point, game) ->
	Player = (name, initialPosition, colour) ->
		@name = name
		@initialPosition = initialPosition
		@currentPosition = new Point(initialPosition.x, initialPosition.y)
		@colour = colour
		@lastTick = 0
		@duration = 1
		@orientation = "right"
		@accelX = 0
		@accelY = 0
		@speedX = 0
		@speedY = 0

	Player::getNextSprite = ->
	  delta = (Date.now() - @lastTick) / 1000
	  frame = 8 * (delta % @duration / @duration) | 0
	  
	  offset = 19

	  sprite = [
	    offset + (frame * 109)
	    28
	    109
	    100
	  ]
	  
	  #console.log(frame + " " + sprite);
	  sprite
	
	Player::goLeft = ->
		@currentPosition.x -= 10
		@orientation = "left"

	Player::goRight = ->
		@currentPosition.x += 10
		@orientation = "right"
		
	Player::goUp = ->
		@currentPosition.y -= 10
		
	Player::goDown = ->
		@currentPosition.y += 10
		
	Player::getImage = ->
		if @orientation is "left"
			game.images.bird_left
		else
			game.images.bird_right

	return Player