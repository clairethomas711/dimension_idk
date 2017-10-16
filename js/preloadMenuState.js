let preloadMenuState = function() {
	
}

preloadMenuState.prototype.preload = function() {
	//load the spritesheets
	game.load.spritesheet("dust", "assets/Dust.png", 1334, 750);
	
	// Load the background
	game.load.image("menuBackground", "assets/MenuBackground.png");

	//load the play button
	game.load.image("play", "assets/PlayButton.png");
	
	game.load.audio('MainMusic', 'assets/sound/TitleMusic.ogg');
	
}

preloadMenuState.prototype.create = function() {
	game.state.start("MenuState");
}

preloadMenuState.prototype.update = function() {
	
}