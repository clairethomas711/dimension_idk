let preloadThreeState = function() {
	
}

preloadThreeState.prototype.preload = function() {
	game.load.spritesheet("platform3D", "assets/AlienPlatform3D.png", 308, 308);
	game.load.image("diminv", "assets/DimensionInvention.png");
	
	// Load the background
	game.load.image("alien_bg1", "Backgrounds/level3/Background_Alien_1.png");
	game.load.image("alien_bg2", "Backgrounds/level3/Background_Alien_2.png");
	game.load.image("alien_bg3", "Backgrounds/level3/Background_Alien_3.png");
	game.load.image("alien_bg4", "Backgrounds/level3/Background_Alien_4.png");
	game.load.image("alien_bg5", "Backgrounds/level3/Background_Alien_5.png");
	game.load.image("alien_bg6", "Backgrounds/level3/Background_Alien_6.png");
	game.load.image("alien_bg7", "Backgrounds/level3/Background_Alien_7.png");
	
	// Load the levels and tilesets
	game.load.tilemap('level3', 'assets/Tilemap/level3.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('level3tiles', 'assets/Tilemap/AlienTIles.png');
	
	game.load.audio("AlienMusic", "assets/sound/AlienMusic.ogg");
}

preloadThreeState.prototype.create = function() {
	game.state.start("LevelThreeState");
}

preloadThreeState.prototype.update = function() {
	
}