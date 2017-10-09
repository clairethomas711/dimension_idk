/** @constructor */
let gameplayState = function()
{
	this.score = 0;
};

gameplayState.prototype.preload = function()
{
};

gameplayState.prototype.create = function()
{ 
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'bg');

    this.platforms = game.add.group();
    this.platforms.enableBody = true;

    let ledge = this.platforms.create(400, 400, 'platform');
    ledge.body.immovable = true;
    ledge = this.platforms.create(-150, 250, 'platform');
    ledge.body.immovable = true;

    this.player = game.add.sprite(0, 0, 'buttchin');
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [0, 1, 2, 3], 10, true);
		this.player.anchor.setTo(0.5, 0.5);

    this.cursors = game.input.keyboard.createCursorKeys();
};

gameplayState.prototype.update = function()
{ 
    game.physics.arcade.collide(this.player, this.platforms);
    //this.player.body.velocity.x = 0;

    if (this.cursors.left.isDown)
    {
				this.player.scale.x *= -1;
        this.player.body.velocity.x = -150;
        this.player.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
				this.player.scale.x *= -1;
        this.player.body.velocity.x = 150;
        this.player.animations.play('right');
    }
    else
    {
        //this.player.animations.stop();
        this.player.frame = 4;
    }
    
    if (this.cursors.up.isDown && this.player.body.touching.down)
    {
        this.player.body.velocity.y = -350;
    }
 
};