let menuState = function() {
	
}

menuState.prototype.preload = function() {
	
}

menuState.prototype.create = function() {

	this.background = game.add.image(0,0,"menuBackground");
	this.playsprite = game.add.button(990,570,"play", this.playOnClick, this);
	
	this.screen = game.add.sprite(0,0,"dust");
	this.screen.animations.add("constant", [0,1,2,3,4,5], 10, true);
}

menuState.prototype.update = function() {

	this.screen.animations.play("constant");

}

menuState.prototype.playOnClick = function() {
		game.state.start("PreloadOneState");
}






