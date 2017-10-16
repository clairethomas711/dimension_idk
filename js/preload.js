//constructor. A function constructor, no less!
let preloadState = function()
{

};

//when Phaser creates an instance of this state, we want it to
preloadState.prototype.preload = function()
{
    game.load.image('bg', 'Backgrounds/Background_Fantasy_Full.png');
    game.load.image('platform', 'Backgrounds/platform.png');
    game.load.spritesheet('buttchin', 'Player SpriteSheets/Walk_V1.png', 96, 132);
};

preloadState.prototype.create = function()
{
	game.state.start("Game");
};

preloadState.prototype.update = function()
{

};

preloadState.prototype.create = function() {
	game.state.start("Gameplay");
}

preloadState.prototype.update = function() {
	
}