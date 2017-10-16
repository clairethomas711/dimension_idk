let preloadTwoState = function() {
	
}

preloadTwoState.prototype.preload = function() {
	game.load.spritesheet("platform3D", "assets/FantasyPlatform3D.png", 256, 256);
	game.load.spritesheet("doddy", "assets/Doddy.png", 96, 132);
	
	// Load the background
	game.load.image("fantasy_bg1", "Backgrounds/level1/Background_Fantasy_1.png");
	game.load.image("fantasy_bg2", "Backgrounds/level1/Background_Fantasy_2.png");
	game.load.image("fantasy_bg3", "Backgrounds/level1/Background_Fantasy_3.png");
	game.load.image("fantasy_bg4", "Backgrounds/level1/Background_Fantasy_4.png");
	game.load.image("fantasy_bg5", "Backgrounds/level1/Background_Fantasy_5.png");
	
	// Load the levels and tilesets
	game.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('level1tiles', 'assets/FantasyTIles.png');
	
	//Load the Credits
	game.load.text("Credits", "assets/credits.txt");
	
}

preloadTwoState.prototype.create = function() {
	game.state.start("LevelTwoState");
}

preloadTwoState.prototype.update = function() {
	
}