let menuState = function() {
	
}

menuState.prototype.preload = function() {
	
}

menuState.prototype.create = function() {
	this.gameFunctions = new gameplayFunctions(); //THIS LINE IS IMPORTANT
	//game.world.setBounds(0, 0, 5000, 900); //enable to see how camera works

	this.background = game.add.image(0,0,"menuBackground");
	//this.playsprite = game.add.image(990,570,"play");
	
	this.screen = game.add.sprite(0,0,"dust");
	this.screen.animations.add("constant", [0,1,2,3,4,5], 10, true);

	play_button = game.add.button(900, 570, 'play', actionOnClick, this);
}

menuState.prototype.update = function() {

	this.screen.animations.play("constant");
	
}

function actionOnClick () {

	game.state.start("PreloadOneState");

}


















