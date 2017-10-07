let gameplayState = function() {
	let sideFacing = true;
	let played = false;
	this.score = 0;
}

gameplayState.prototype.preload = function() {
	
}

gameplayState.prototype.create = function() {
	sideFacing = true;
	game.add.sprite(0, 0, "sky");
	game.physics.startSystem(Phaser.Physics.ARCADE);
	this.platforms = game.add.group();
	this.platforms.enableBody = true;
	
	this.stars = game.add.group();
	this.stars.enableBody = true;
	for(let i = 0;i < 12;i++) {
		let star = this.stars.create(i * 70, 0, "star");
		star.body.gravity.y = 2000;
		star.body.bounce.y = Math.random();
	}
	
	let ground = this.platforms.create(0, game.world.height - 64, "platform");
	ground.scale.setTo(2,2);
	ground.body.immovable = true;
	
	let plat = this.platforms.create(400, 400, "platform");
	plat.body.immovable = true;
	plat = this.platforms.create(-150, 250, "platform");
	plat.body.immovable = true;
	
	this.player = game.add.sprite(32, 450, "shrek");
	game.physics.arcade.enable(this.player);
	this.player.body.gravity.y = 400;
	this.player.body.bounce.y = 0.15;
	this.player.body.collideWorldBounds = true;
	
	this.platform3D = game.add.sprite(100, 100, "platform3D");
	this.platform3D.animations.add("xz2yx", [0, 5], 10, false);
	
	this.player.animations.add("left", [0, 1, 2, 3], 10, true);
	this.player.animations.add("right", [5, 6, 7, 8], 10, true);
	
	this.scoreText = game.add.text(16, 16, "Score: 0", {fontSize: "32pt", fill: "#000000"});
	
	this.cursors = game.input.keyboard.createCursorKeys();
}

gameplayState.prototype.update = function() {
	game.physics.arcade.collide(this.player, this.platforms);
	game.physics.arcade.collide(this.stars, this.platforms);
	
	game.physics.arcade.overlap(this.player, this.stars, this.collectStar);
	
	this.platform3D.animations.play("xz2yx");
	
	this.player.body.velocity.x = 0;
	
	if(this.cursors.left.isDown) {
		this.player.animations.play("left");
		this.player.body.velocity.x = -400;
		sideFacing = false;
	}
	else if(this.cursors.right.isDown) {
		this.player.animations.play("right");
		this.player.body.velocity.x = 400;
		sideFacing = true;
	}
	else {
		this.player.animations.stop();
		if(!sideFacing)
			this.player.frame = 0;
		else
			this.player.frame = 5
	}
	
	if(this.cursors.up.isDown && this.player.body.touching.down) {
		this.player.body.velocity.y = -400;
	}
}

gameplayState.prototype.collectStar = function(player, star) {
	star.kill();
	this.score++;
	//this.scoreText.text = "Score: " + this.score;
}




































