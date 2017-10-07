let preloadState = function() {
	
}

preloadState.prototype.preload = function() {
	game.load.image("sky", "assets/sky.png");
	game.load.image("platform", "assets/platform.png");
	game.load.image("star", "assets/star.png");
	game.load.spritesheet("platform3D", "assets/blockRotationSheet.png", 256, 256);
	game.load.spritesheet("shrek", "assets/dude.png", 32, 48);
}

preloadState.prototype.create = function() {
	game.state.start("Gameplay");
}

preloadState.prototype.update = function() {
	
}