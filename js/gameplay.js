let gameplayState = function() {
	let sideFacing = true;
	let played = false;
	this.score = 0;
	
	let platformState = state3D.XbyY;
	let rotating = false;
	let enum state3D { //this is important
		XbyY = 1, //X is along the screen X axis and Y is along the screen Y axis
		ZbyY = 2, //Z is along the screen X axis and Y is along the screen Y axis
		XbyZ = 3, //X is along the screen X axis and Z is along the screen Y axis
		YbyX = 4, //Y is along the screen X axis and X is along the screen Y axis
		YbyZ = 5, //Y is along the screen X axis and Z is along the screen Y axis
		ZbyX = 6, //Z is along the screen X axis and X is along the screen Y axis
	}
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
	
	//begin platform code
	
	this.platform3D = game.add.sprite(100, 100, "platform3D");
	//animations from XbyY
	this.platform3D.animations.add("XbyYtoZbyYLeft", [0, 1], 10, false);
	this.platform3D.animations.add("XbyYtoZbyYRight", [0, 1], 10, false);
	this.platform3D.animations.add("XbyYtoXbyZLeft", [0, 2], 10, false); //in the case of a y rotation, left is up and right is down
	this.platform3D.animations.add("XbyYtoXbyZRight", [0, 2], 10, false);
	//animations from ZbyY
	this.platform3D.animations.add("ZbyYtoXbyYLeft", [1, 0], 10, false);
	this.platform3D.animations.add("ZbyYtoXbyYRight", [1, 0], 10, false);
	this.platform3D.animations.add("ZbyYtoZbyXLeft", [1, 5], 10, false);
	this.platform3D.animations.add("ZbyYtoZbyXRight", [1, 5], 10, false);
	//animations from XbyZ
	this.platform3D.animations.add("XbyZtoXbyYLeft", [2, 0], 10, false);
	this.platform3D.animations.add("XbyZtoXbyYRight", [2, 0], 10, false);
	this.platform3D.animations.add("XbyZtoYbyZLeft", [2, 4], 10, false);
	this.platform3D.animations.add("XbyZtoYbyZRight", [2, 4], 10, false);
	//animations from YbyX
	this.platform3D.animations.add("YbyXtoZbyXLeft", [3, 5], 10, false);
	this.platform3D.animations.add("YbyXtoZbyXRight", [3, 5], 10, false);
	this.platform3D.animations.add("YbyXtoYbyZLeft", [3, 4], 10, false);
	this.platform3D.animations.add("YbyXtoYbyZRight", [3, 4], 10, false);
	//animations from YbyZ
	this.platform3D.animations.add("YbyZtoYbyXLeft", [4, 3], 10, false);
	this.platform3D.animations.add("YbyZtoYbyXRight", [4, 3], 10, false);
	this.platform3D.animations.add("YbyZtoXbyZLeft", [4, 2], 10, false);
	this.platform3D.animations.add("YbyZtoXbyZRight", [4, 2], 10, false);
	//animations from ZbyX
	this.platform3D.animations.add("ZbyXtoYbyXLeft", [5, 3], 10, false);
	this.platform3D.animations.add("ZbyXtoYbyXRight", [5, 3], 10, false);
	this.platform3D.animations.add("ZbyXtoZbyYLeft", [5, 1], 10, false);
	this.platform3D.animations.add("ZbyXtoZbyYRight", [5, 1], 10, false);
	
	//end platform code
	this.player.animations.add("left", [0, 1, 2, 3], 10, true);
	this.player.animations.add("right", [5, 6, 7, 8], 10, true);
	
	this.scoreText = game.add.text(16, 16, "Score: 0", {fontSize: "32pt", fill: "#000000"});
	
	this.cursors = game.input.keyboard.createCursorKeys();
}

gameplayState.prototype.update = function() {
	game.physics.arcade.collide(this.player, this.platforms);
	game.physics.arcade.collide(this.stars, this.platforms);
	
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
	
	//begin platform code
	let dir = 0;
	if(this.cursors.up.onDown)
	{
		dir = 0;
		rotating = true;
	}
	if(this.cursors.right.onDown)
	{
		dir = 1;
		rotating = true;
	}
	if(this.cursors.down.onDown)
	{
		dir = 2;
		rotating = true;
	}
	if(this.cursors.left.onDown)
	{
		dir = 3;
		rotating = true;
	}
	if(rotating)
		rotatePlatform(platform3D, platformState, dir);
	rotating = false;
	
	//end platform code
}

gameplayState.prototype.rotatePlatform = function(platform, state, input) { //platform object to rotate will hold state value in future, input is the rotation direction
	let caseFailure = false;
	switch(state) {
		case state3D.XbyY: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					this.platform3D.animations.play("XbyYtoXbyZLeft");
					platformState = state3D.XbyZ;
					//set hitbox
					break;
				}
				case 1: {
					this.platform3D.animations.play("XbyYtoZbyYRight");
					platformState = state3D.ZbyY;
					//set hitbox
					break;
				}
				case 2: {
					this.platform3D.animations.play("XbyYtoXbyZRight");
					platformState = state3D.XbyZ;
					//set hitbox
					break;
				}
				case 3: {
					this.platform3D.animations.play("XbyYtoZbyYLeft");
					platformState = state3D.ZbyY;
					//set hitbox
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case state3D.ZbyY: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					this.platform3D.animations.play("ZbyYtoZbyXLeft");
					platformState = state3D.ZbyX;
					//set hitbox
					break;
				}
				case 1: {
					this.platform3D.animations.play("ZbyYtoXbyYRight");
					platformState = state3D.XbyY;
					//set hitbox
					break;
				}
				case 2: {
					this.platform3D.animations.play("ZbyYtoZbyXRight");
					platformState = state3D.ZbyX;
					//set hitbox
					break;
				}
				case 3: {
					this.platform3D.animations.play("ZbyYtoXbyYLeft");
					platformState = state3D.XbyY;
					//set hitbox
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case state3D.XbyZ: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					this.platform3D.animations.play("XbyZtoXbyYLeft");
					platformState = state3D.XbyY;
					//set hitbox
					break;
				}
				case 1: {
					this.platform3D.animations.play("XbyZtoYbyZRight");
					platformState = state3D.YbyZ;
					//set hitbox
					break;
				}
				case 2: {
					this.platform3D.animations.play("XbyZtoXbyYRight");
					platformState = state3D.XbyY;
					//set hitbox
					break;
				}
				case 3: {
					this.platform3D.animations.play("XbyZtoYbyZLeft");
					platformState = state3D.YbyZ;
					//set hitbox
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case state3D.YbyX: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					this.platform3D.animations.play("YbyXtoYbyZLeft");
					platformState = state3D.YbyZ;
					//set hitbox
					break;
				}
				case 1: {
					this.platform3D.animations.play("YbyXtoZbyXRight");
					platformState = state3D.ZbyX;
					//set hitbox
					break;
				}
				case 2: {
					this.platform3D.animations.play("YbyXtoYbyZRight");
					platformState = state3D.YbyZ;
					//set hitbox
					break;
				}
				case 3: {
					this.platform3D.animations.play("YbyXtoZbyXLeft");
					platformState = state3D.ZbyX;
					//set hitbox
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case state3D.YbyZ: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					this.platform3D.animations.play("YbyZtoYbyXLeft");
					platformState = state3D.YbyX;
					//set hitbox
					break;
				}
				case 1: {
					this.platform3D.animations.play("YbyZtoXbyZRight");
					platformState = state3D.XbyZ;
					//set hitbox
					break;
				}
				case 2: {
					this.platform3D.animations.play("YbyZtoYbyXRight");
					platformState = state3D.YbyX;
					//set hitbox
					break;
				}
				case 3: {
					this.platform3D.animations.play("YbyZtoXbyZLeft");
					platformState = state3D.XbyZ;
					//set hitbox
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case state3D.ZbyX: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					this.platform3D.animations.play("ZbyXtoZbyYLeft");
					platformState = state3D.ZbyY;
					//set hitbox
					break;
				}
				case 1: {
					this.platform3D.animations.play("ZbyXtoYbyXRight");
					platformState = state3D.YbyX;
					//set hitbox
					break;
				}
				case 2: {
					this.platform3D.animations.play("ZbyXtoZbyYRight");
					platformState = state3D.ZbyY;
					//set hitbox
					break;
				}
				case 3: {
					this.platform3D.animations.play("ZbyXtoYbyXLeft");
					platformState = state3D.YbyX;
					//set hitbox
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		default: {
			caseFailure = true;
			break;
		}
	}
	if(caseFailure)
	{
		let i = 0;
		//print something
	}
}
























































