let preloadTwoState = function() {
	
}

preloadTwoState.prototype.preload = function() {
	game.load.spritesheet("platform3D", "assets/WestPlatform3D.png", 290, 290);
	game.load.spritesheet("doddy", "assets/West_Doddy.png", 96, 132);
	
	// Load the background
	game.load.image("weast_bg1", "Backgrounds/level2/Background_Weast_1.png");
	game.load.image("weast_bg2", "Backgrounds/level2/Background_Weast_2.png");
	game.load.image("weast_bg3", "Backgrounds/level2/Background_Weast_3.png");
	game.load.image("weast_bg4", "Backgrounds/level2/Background_Weast_4.png");
	game.load.image("weast_bg5", "Backgrounds/level2/Background_Weast_5.png");
	game.load.image("weast_bg6", "Backgrounds/level2/Background_Weast_6.png");
	
	
	// Load the levels and tilesets
	game.load.tilemap('level2', 'assets/Tilemap/level2.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.image('level2tiles', 'assets/Tilemap/WeastTiles.png');
	
	game.load.audio("WeastMusic", "assets/sound/WeastMusic.ogg");
	
	game.load.image("rotatePreventionY", "assets/yRotationPrevention.png");
	
	game.load.image("rotatePreventionX", "assets/xRotationPrevention.png");
	
	game.load.image("rotatePreventionS", "assets/sRotationPrevention.png");
}

preloadTwoState.prototype.create = function() {
	game.state.start("LevelTwoState");
}

preloadTwoState.prototype.update = function() {
	
}