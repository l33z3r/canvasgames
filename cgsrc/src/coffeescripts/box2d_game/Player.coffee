define ["game"], (game) ->
	Player = (name) ->
		game.loadImages "bird_right"
		@name = name
		@lastTick = 0
		@duration = 1

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
	
	Player::getImage = ->
		game.images.bird_right

	return Player