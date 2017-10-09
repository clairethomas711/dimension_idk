let preloadState = function() {
	
}

preloadState.prototype.preload = function() {
	game.load.image("sky", "assets/sky.png");
	game.load.image("platform", "assets/platform.png");
	game.load.image("star", "assets/star.png");
	game.load.spritesheet("platform3D", "assets/blockRotationSheet.png", 256, 256);
	game.load.spritesheet("shrek", "assets/dude.png", 32, 48);
	
	// Load the background
	game.load.image("fantasy_bg1", "Backgrounds/level1/Background_Fantasy_1.png");
	game.load.image("fantasy_bg2", "Backgrounds/level1/Background_Fantasy_2.png");
	game.load.image("fantasy_bg3", "Backgrounds/level1/Background_Fantasy_3.png");
	game.load.image("fantasy_bg4", "Backgrounds/level1/Background_Fantasy_4.png");
	game.load.image("fantasy_bg5", "Backgrounds/level1/Background_Fantasy_5.png");
}

preloadState.prototype.create = function() {
	game.state.start("Gameplay");
}

preloadState.prototype.update = function() {
	
}