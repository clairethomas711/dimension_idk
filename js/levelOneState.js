let levelOneState = function() {
	let sideFacing = true;
	let played = false;
	let mouseDown = false;
	let tapMade = false;
	let goingLeft = false;
	let goingRight = false;
	let stopped = true;
	
	this.pressX = 0;
	this.pressY = 0;
	this.playerDirection = 0;
	this.willCheckOverlap = false;
	this.checkOverlap = false;
	this.selectedPlayer = false;
	this.selectedPlatform = false;
	this.currentSelectedPlat;
	
	this.rotationTimer = 0;
	
	this.checkX = 0;
	this.checkY = 0;
	
	//begin enum and stuff coding
	this.state3D = { //this is important
		XbyY: 0, //X is along the screen X axis and Y is along the screen Y axis
		ZbyY: 1, //Z is along the screen X axis and Y is along the screen Y axis
		XbyZ: 2, //X is along the screen X axis and Z is along the screen Y axis
		YbyX: 3, //Y is along the screen X axis and X is along the screen Y axis
		YbyZ: 4, //Y is along the screen X axis and Z is along the screen Y axis
		ZbyX: 5 //Z is along the screen X axis and X is along the screen Y axis
	};
	this.platformStates = [0,1,4,5];
	this.platformsX = [100,200,300,400];
	this.platformsY = [100,200,300,400];
	//end enum and stuff coding
	
	
	// Cutscene stuff
	this.inCutscene = false;
	this.cutsceneIndex = 0;
	this.styleDoddy = { font: "32px Arial", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: 300 };
	this.styleDoomsday = { font: "32px Misfits", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: 500 };
	this.levelDone = false;
}

levelOneState.prototype.preload = function() {
	this.stopped = true;
}

levelOneState.prototype.create = function() {
	
	//Music & sound stuff first
	this.music = game.add.audio('FantasyMusic');
	this.music.loop = true;
    this.music.play();
	
	this.platSound = game.add.audio('PlatSound');
	
	
	this.gameFunctions = new gameplayFunctions(); //THIS LINE IS IMPORTANT
	game.world.setBounds(0, 0, 5000, 900); //enable to see how camera works
	sideFacing = true;
	//game.add.sprite(0, 0, "sky");
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Create the parallaxing background and some variables for it
	this.createBackground();
	
	//Load and create the level from tiled
	this.createLevel();
	
	
	//This finds where the player start is in tiled and gets the position
	let playerpos = this.gameFunctions.findObjectsByType('playerstart',this.map,'objectlayer'); //EDITED TAKE NOTE
	
	this.player = game.add.sprite(playerpos[0].x + 32, playerpos[0].y + 64, "doddy");
	this.checkX = playerpos[0].x + 32;
	this.checkY = playerpos[0].y + 64;
	game.physics.arcade.enable(this.player);
	this.player.body.gravity.y = 1200;
	this.player.anchor.setTo(.5,.5);
	this.player.body.setSize(60,120,24,12);
	this.player.animations.add("walk", [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
	this.player.animations.add("idle", [0, 1, 2, 3, 4, 5], 10, true);
	this.player.animations.add("jump", [6, 7], 10, false);
	this.player.inputEnabled = true;
	this.player.animations.play("idle");
	this.slowToZero = true;
	this.directionWalking = true;
	
	this.rotatePreventerX = game.add.sprite(-1000, -1000, "rotatePreventionX");
	game.physics.arcade.enable(this.rotatePreventerX);
	this.rotatePreventerY = game.add.sprite(-1000, -1000, "rotatePreventionY");
	game.physics.arcade.enable(this.rotatePreventerY);
	this.rotatePreventerS = game.add.sprite(-1000, -1000, "rotatePreventionS"); //make sure player isn't standing on block
	game.physics.arcade.enable(this.rotatePreventerS);
	
	// Controls Stuff
	game.input.onUp.add(this.mouseUp, this);
    game.input.onDown.add(this.mouseDown, this);
	this.tapInput = game.add.sprite(0, 0);
	this.tapInput.anchor.setTo(.5, .5);
	game.physics.arcade.enable(this.tapInput);
	this.tapInput.body.setSize(70,40,-15,0);
	game.input.mouse.capture = true;
	
	//begin temp cam code
	
	game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	
	//end temp cam code
	
	//begin platform code
	this.platform3DGroup = game.add.group();
	let result = this.gameFunctions.findObjectsByType('platform',this.map,'objectlayer');
	for(let i = 0;i < result.length;i++)
	{
		let tempPlatform3D = this.platform3DGroup.create(result[i].x + 128, result[i].y + 128, "platform3D");
		
		//animations from XbyY
		tempPlatform3D.animations.add("XbyYtoZbyYLeft", [44,43,42,41,40,39,38,37,36,35,34,33,32,31,30], 25, false); //rotate by 90
		tempPlatform3D.animations.add("XbyYtoZbyYRight", [44,43,42,41,40,39,38,37,36,35,34,33,32,31,30], 25, false); //opposite rotate by 90
		tempPlatform3D.animations.add("XbyYtoXbyZLeft", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], 25, false); //in the case of a y rotation, left is up and right is down
		tempPlatform3D.animations.add("XbyYtoXbyZRight", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], 25, false); //by 180
		//animations from ZbyY
		tempPlatform3D.animations.add("ZbyYtoXbyYLeft", [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44], 25, false);
		tempPlatform3D.animations.add("ZbyYtoXbyYRight", [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44], 25, false);
		tempPlatform3D.animations.add("ZbyYtoZbyXLeft", [29,28,27,26,25,24,23,22,21,20,19,18,17,16,15], 25, false);
		tempPlatform3D.animations.add("ZbyYtoZbyXRight", [29,28,27,26,25,24,23,22,21,20,19,18,17,16,15], 25, false);
		//animations from XbyZ
		tempPlatform3D.animations.add("XbyZtoXbyYLeft", [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0], 25, false);
		tempPlatform3D.animations.add("XbyZtoXbyYRight", [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0], 25, false);
		tempPlatform3D.animations.add("XbyZtoYbyZLeft", [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], 25, false);
		tempPlatform3D.animations.add("XbyZtoYbyZRight", [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], 25, false);
		//animations from YbyX
		tempPlatform3D.animations.add("YbyXtoZbyXLeft", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], 25, false); //by 90
		tempPlatform3D.animations.add("YbyXtoZbyXRight", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14], 25, false); //by 270?
		tempPlatform3D.animations.add("YbyXtoYbyZLeft", [44,43,42,41,40,39,38,37,36,35,34,33,32,31,30], 25, false);
		tempPlatform3D.animations.add("YbyXtoYbyZRight", [44,43,42,41,40,39,38,37,36,35,34,33,32,31,30], 25, false);//by 180
		//animations from YbyZ
		tempPlatform3D.animations.add("YbyZtoYbyXLeft", [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44], 25, false);
		tempPlatform3D.animations.add("YbyZtoYbyXRight", [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44], 25, false);
		tempPlatform3D.animations.add("YbyZtoXbyZLeft", [29,28,27,26,25,24,23,22,21,20,19,18,17,16,15], 25, false);
		tempPlatform3D.animations.add("YbyZtoXbyZRight", [29,28,27,26,25,24,23,22,21,20,19,18,17,16,15], 25, false);
		//animations from ZbyX
		tempPlatform3D.animations.add("ZbyXtoYbyXLeft", [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0], 25, false);
		tempPlatform3D.animations.add("ZbyXtoYbyXRight", [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0], 25, false);
		tempPlatform3D.animations.add("ZbyXtoZbyYLeft", [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], 25, false);
		tempPlatform3D.animations.add("ZbyXtoZbyYRight", [15,16,17,18,19,20,21,22,23,24,25,26,27,28,29], 25, false);
		
		game.physics.arcade.enable(tempPlatform3D);
		tempPlatform3D.body.immovable = true;
		tempPlatform3D.state = (result[i].properties.orientation);
		this.setPlatformPhysics(result[i].properties.orientation);
		switch(result[i].properties.orientation) {
			case this.state3D.XbyY: {
				tempPlatform3D.frame = 0;
				break;
			}
			case this.state3D.ZbyY: {
				tempPlatform3D.frame = 29;
				tempPlatform3D.angle = 90;
				break;
			}
			case this.state3D.XbyZ: {
				tempPlatform3D.frame = 14;
				break;
			}
			case this.state3D.YbyX: {
				tempPlatform3D.frame = 44;
				break;
			}
			case this.state3D.YbyZ: {
				tempPlatform3D.frame = 29;
				break;
			}
			case this.state3D.ZbyX: {
				tempPlatform3D.frame = 14;
				tempPlatform3D.angle = 90;
				break;
			}
			default: {
				break;
			}
		}
		this.setPlatformPhysics(tempPlatform3D);
		tempPlatform3D.anchor.setTo(.5,.5);
	}
	
	
	game.physics.arcade.enable(this.platform3DGroup);
	//end platform code
	
	
	///////////////////
	// Cutscene Code //
	///////////////////
	
	this.triggerGroup = game.add.group();
	let triggers = this.gameFunctions.findObjectsByType('cutscene',this.map,'objectlayer');
	for(let i = 0;i < triggers.length;i++) {
		let tempTrigger = this.triggerGroup.create(triggers[i].x, triggers[i].y);
		game.physics.arcade.enable(tempTrigger);
		tempTrigger.body.setSize(64,750,0,0);
	}
	result = this.gameFunctions.findObjectsByType('doomsday',this.map,'objectlayer');
	this.doomsday = game.add.sprite(result[0].x, result[0].y, "doomsday");
	this.doomsday.animations.add("idle", [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
	this.doomsday.animations.play("idle");
	this.doomsday.scale.x = -1;
	game.physics.arcade.enable(this.doomsday);
	
	this.transition = game.add.sprite(0, 0, "transition");
	this.transition.animations.add("open", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 20, false);
	this.transition.animations.add("close", [23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], 20, false);
	this.transition.fixedToCamera = true;
	this.transition.animations.play("open");
}

levelOneState.prototype.update = function() {
	
	game.physics.arcade.collide(this.player, this.walls, this.onGround, null, this);
	game.physics.arcade.collide(this.player, this.platform3DGroup, this.onGround);
	game.physics.arcade.collide(this.player, this.danger, this.gameFunctions.kill, null, this);
	game.physics.arcade.overlap(this.player, this.triggerGroup, this.startCutscene, null, this);
	
	if (this.doomsday.x > 4000) {
		this.doomsday.kill();
	}
	
	// Do parallax
	this.doParallax(this);
	
	/////////////////////
	// Player controls //
	/////////////////////
	
	// First, some animation and polish stuff
	if (this.isJumping && (this.player.body.blocked.down || this.player.body.touching.down)) {
		this.isJumping = false;
		this.player.animations.play("walk");
		this.isWalking = true;
	}
	if (this.isJumping && (this.player.body.blocked.right || this.player.body.blocked.left || this.player.body.touching.right || this.player.body.touching.left)) {
		if (sideFacing) {
			this.slowToZero = false;
			this.player.body.velocity.x = 300;
		} else {
			this.slowToZero = false;
			this.player.body.velocity.x = -300;
		}
	}
	if (this.isWalking && this.player.body.velocity.x == 0) {
		this.isWalking = false;
		this.player.animations.play("idle");
	}
	if (this.isWalking && this.player.body.velocity.y > 10) {
		this.isJumping = true;
		this.player.animations.stop();
		this.player.frame = 7;
		this.isWalking = false;
	}
	if (this.player.body.velocity.y > 10) {
		this.isJumping = true;
		this.player.animations.stop();
		this.player.frame = 7;
		this.isWalking = false;
	}
	
	if(this.slowToZero) //add a slowing animation, probably just walking animation but slower
	{
		this.player.body.velocity.x = 0;
	}
	else
	{
		if (this.directionWalking)
		{
			this.player.body.velocity.x = 300;
		}
		else
		{
			this.player.body.velocity.x = -300;
		}
	}
	
	// Ok this looks weird but basically i need to wait 1 frame before checking if we tapped something,
	// so this is my rube goldberg tap-checking machine.
	if (this.checkOverlap) {
		this.checkOverlap = false;
		game.physics.arcade.overlap(this.player, this.tapInput, this.tapPlayer, null, this)
		if (!this.selectedPlayer) {
			game.physics.arcade.overlap(this.tapInput, this.platform3DGroup, this.tapPlatform, null, this)
		}
	}
	if (this.willCheckOverlap) {
		this.willCheckOverlap = false;
		this.checkOverlap = true;
	}
	
	//Check if we swiped any direction, and do stuff if we did.
	if (this.selectedPlayer && game.input.activePointer.leftButton.isDown) {
		if (game.input.x - this.pressX > 100) {
			this.player.scale.x = 1;
			this.player.animations.play("walk");
			this.slowToZero = false;
			this.directionWalking = true; //true for right
			sideFacing = true;
			this.selectedPlayer = false;
			this.isWalking = true;
		} else if (game.input.x - this.pressX < (-100)) {
			this.player.scale.x = -1;
			this.player.animations.play("walk");
			this.slowToZero = false;
			this.directionWalking = false; //false for left
			sideFacing = false;
			this.selectedPlayer = false;
			this.isWalking = true;
		} else if ((game.input.y - this.pressY < (-100)) && (this.player.body.blocked.down || this.player.body.touching.down)) {
			this.player.animations.stop();
			this.player.frame = 6;
			if (sideFacing) {
				this.slowToZero = false;
				this.player.body.velocity.x = 300;
			} else {
				this.slowToZero = false;
				this.player.body.velocity.x = -300;
			}
			this.player.body.velocity.y = -600;
			this.selectedPlayer = false;
			this.isJumping = true;
		}
	}
	
	//Same, but for platforms
	let dir = 0;
	if (this.selectedPlatform && game.input.activePointer.leftButton.isDown && !this.rotating) {
		this.rotatePreventerX.position.x = this.player.position.x - (128 - 20);
		this.rotatePreventerX.position.y = this.player.position.y - (128 - 64);
		this.rotatePreventerY.position.x = this.player.position.x - (128 - 96);
		this.rotatePreventerY.position.y = this.player.position.y - 128;
		this.rotatePreventerY.position.x = this.player.position.x - (128 - 96);
		this.rotatePreventerY.position.y = this.player.position.y - 128;
		if (game.input.x - this.pressX > 100) {
			dir = 1;
			this.rotating = true;
			this.selectedPlatform = false;
			if(!game.physics.arcade.overlap(this.rotatePreventerX, this.currentSelectedPlat)
				&& !game.physics.arcade.overlap(this.rotatePreventerS, this.currentSelectedPlat))
				this.rotatePlatform(this.currentSelectedPlat, dir);
		}
		if (game.input.x - this.pressX < (-100)) {
			dir = 3;
			this.rotating = true;
			this.selectedPlatform = false;
			if(!game.physics.arcade.overlap(this.rotatePreventerX, this.currentSelectedPlat)
				&& !game.physics.arcade.overlap(this.rotatePreventerS, this.currentSelectedPlat))
				this.rotatePlatform(this.currentSelectedPlat, dir);
		}
		if (game.input.y - this.pressY > 100) {
			dir = 2;
			this.rotating = true;
			this.selectedPlatform = false;
			if(!game.physics.arcade.overlap(this.rotatePreventerY, this.currentSelectedPlat)
				&& !game.physics.arcade.overlap(this.rotatePreventerS, this.currentSelectedPlat))
				this.rotatePlatform(this.currentSelectedPlat, dir);
		}
		if (game.input.y - this.pressY < (-100)) {
			dir = 0;
			this.rotating = true;
			this.selectedPlatform = false;
			if(!game.physics.arcade.overlap(this.rotatePreventerY, this.currentSelectedPlat)
				&& !game.physics.arcade.overlap(this.rotatePreventerS, this.currentSelectedPlat))
				this.rotatePlatform(this.currentSelectedPlat, dir);
		}
	}
	
	//////////////////
	// End Controls //
	//////////////////
		
		
		
	//begin platform code
	if(this.rotating && this.rotationTimer == 0) {
		this.rotationTimer = game.time.totalElapsedSeconds();
	}
	if((game.time.totalElapsedSeconds() - this.rotationTimer) >= 0.5)
	{
		this.rotating = false;
		this.rotationTimer = 0;
	}
	//end platform code
	
	//begin switching level code
	
	if(this.levelDone && this.transition.animations.currentFrame.index === 0)//UPON REACH END
	{
		this.music.stop();
		game.state.start("PreloadTwoState");
	}
	
	//end switching level code

}

/*
levelOneState.prototype.render = function() {
	game.debug.body(this.tapInput);
	game.debug.body(this.player);
	
	for (let i = 0; i < this.platform3DGroup.length; i++) {
		game.debug.body(this.platform3DGroup.children[i]);
	}
} */

levelOneState.prototype.rotatePlatform = function(plat, input) {
	let caseFailure = false;
	switch(plat.state) {
		case this.state3D.XbyY: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					plat.animations.play("XbyYtoXbyZLeft", false);
					plat.state = this.state3D.XbyZ;
					plat.angle = 180;
					break;
				}
				case 1: {
					plat.animations.play("XbyYtoZbyYRight", false);
					plat.state = this.state3D.ZbyY;
					plat.angle = 90;
					break;
				}
				case 2: {
					plat.animations.play("XbyYtoXbyZRight", false);
					plat.state = this.state3D.XbyZ;
					plat.angle = 0;
					break;
				}
				case 3: {
					plat.animations.play("XbyYtoZbyYLeft", false);
					plat.state = this.state3D.ZbyY;
					plat.angle = 270;
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case this.state3D.ZbyY: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					plat.animations.play("ZbyYtoZbyXLeft", false);
					plat.state = this.state3D.ZbyX;
					plat.angle = 90;
					break;
				}
				case 1: {
					plat.animations.play("ZbyYtoXbyYRight", false);
					plat.state = this.state3D.XbyY;
					plat.angle = 270;
					break;
				}
				case 2: {
					plat.animations.play("ZbyYtoZbyXRight", false);
					plat.state = this.state3D.ZbyX;
					plat.angle = 270;
					break;
				}
				case 3: {
					plat.animations.play("ZbyYtoXbyYLeft", false);
					plat.state = this.state3D.XbyY;
					plat.angle = 90;
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case this.state3D.XbyZ: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					plat.animations.play("XbyZtoXbyYLeft", false);
					plat.state = this.state3D.XbyY;
					break;
				}
				case 1: {
					plat.animations.play("XbyZtoYbyZRight", false);
					plat.state = this.state3D.YbyZ;
					break;
				}
				case 2: {
					plat.animations.play("XbyZtoXbyYRight", false);
					plat.state = this.state3D.XbyY;
					plat.angle = 180;
					break;
				}
				case 3: {
					plat.animations.play("XbyZtoYbyZLeft", false);
					plat.state = this.state3D.YbyZ;
					plat.angle = 180;
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case this.state3D.YbyX: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					plat.animations.play("YbyXtoYbyZLeft", false);
					plat.state = this.state3D.YbyZ;
					plat.angle = 0;
					break;
				}
				case 1: {
					plat.animations.play("YbyXtoZbyXRight", false);
					plat.state = this.state3D.ZbyX;
					plat.angle = 270;
					break;
				}
				case 2: {
					plat.animations.play("YbyXtoYbyZRight", false);
					plat.state = this.state3D.YbyZ;
					plat.angle = 180;
					
					break;
				}
				case 3: {
					plat.animations.play("YbyXtoZbyXLeft", false);
					plat.state = this.state3D.ZbyX;
					plat.angle = 90;
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case this.state3D.YbyZ: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					plat.animations.play("YbyZtoYbyXLeft", false);
					plat.state = this.state3D.YbyX;
					plat.angle = 180;
					break;
				}
				case 1: {
					plat.animations.play("YbyZtoXbyZRight", false);
					plat.state = this.state3D.XbyZ;
					plat.angle = 180;
					break;
				}
				case 2: {
					plat.animations.play("YbyZtoYbyXRight", false);
					plat.state = this.state3D.YbyX;
					plat.angle = 0;
					break;
				}
				case 3: {
					plat.animations.play("YbyZtoXbyZLeft", false);
					plat.state = this.state3D.XbyZ;
					plat.angle = 0;
					break;
				}
				default: {
					caseFailure = true;
					break;
				}
			}
			break;
		}
		case this.state3D.ZbyX: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					plat.animations.play("ZbyXtoZbyYLeft", false);
					plat.state = this.state3D.ZbyY;
					plat.angle = 270;
					break;
				}
				case 1: {
					plat.animations.play("ZbyXtoYbyXRight", false);
					plat.state = this.state3D.YbyX;
					plat.angle = 90;
					break;
				}
				case 2: {
					plat.animations.play("ZbyXtoZbyYRight", false);
					plat.state = this.state3D.ZbyY;
					plat.angle = 90;
					break;
				}
				case 3: {
					plat.animations.play("ZbyXtoYbyXLeft", false);
					plat.state = this.state3D.YbyX;
					plat.angle = 270;
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
	if(caseFailure) {
		let i = 0;
		alert("CASE FAIL");
	}
	else {
		this.platSound.play();
		this.setPlatformPhysics(plat);
	}
}

levelOneState.prototype.setPlatformPhysics = function(plat) {
	platState = plat.state;
	switch(platState) {
		case this.state3D.XbyY: {
			plat.body.setSize(256,64,30,126);
			break;
		}
		case this.state3D.ZbyY: {
			plat.body.setSize(128,64,94,126);
			break;
		}
		case this.state3D.XbyZ: {
			plat.body.setSize(256,128,30,94);
			break;
		}
		case this.state3D.YbyX: {
			plat.body.setSize(64,256,126,30);
			break;
		}
		case this.state3D.YbyZ: {
			plat.body.setSize(64,128,126,94);
			break;
		}
		case this.state3D.ZbyX: {
			plat.body.setSize(128,256,94,30);
			break;
		}
		default: {
			break;
		}
	}
}


levelOneState.prototype.createBackground = function() {
	this.sky = this.game.add.tileSprite(0,
        this.game.height - this.game.cache.getImage('fantasy_bg1').height,
        this.game.width,
        this.game.cache.getImage('fantasy_bg1').height,
        'fantasy_bg1'
    );
	this.mtn1 = this.game.add.tileSprite(0,
        this.game.height - this.game.cache.getImage('fantasy_bg2').height,
        this.game.width,
        this.game.cache.getImage('fantasy_bg2').height,
        'fantasy_bg2'
    );
	this.mtn2 = this.game.add.tileSprite(0,
        this.game.height - this.game.cache.getImage('fantasy_bg3').height,
        this.game.width,
        this.game.cache.getImage('fantasy_bg3').height,
        'fantasy_bg3'
    );
	this.tree1 = this.game.add.tileSprite(0,
        this.game.height - this.game.cache.getImage('fantasy_bg4').height,
        this.game.width,
        this.game.cache.getImage('fantasy_bg4').height,
        'fantasy_bg4'
    );
	this.tree2 = this.game.add.tileSprite(0,
        this.game.height - this.game.cache.getImage('fantasy_bg5').height,
        this.game.width,
        this.game.cache.getImage('fantasy_bg5').height,
        'fantasy_bg5'
    );
	this.sky.fixedToCamera = true;
	this.mtn1.fixedToCamera = true;
	this.mtn2.fixedToCamera = true;
	this.tree1.fixedToCamera = true;
	this.tree2.fixedToCamera = true;
	
}

levelOneState.prototype.doParallax = function() {
	this.sky.tilePosition.x -= 0.2;
	this.mtn1.tilePosition.x = game.camera.x * -0.2;
	this.mtn2.tilePosition.x = game.camera.x * -0.35;
	this.tree1.tilePosition.x = game.camera.x * -0.5;
	this.tree2.tilePosition.x = game.camera.x * -0.7;
	
}

levelOneState.prototype.createLevel = function() {
	this.map = this.game.add.tilemap('level1');
	this.map.addTilesetImage('FantasyTiles', 'level1tiles');
	
	this.background = this.map.createLayer('background');
	this.danger = this.map.createLayer('danger');
    this.walls = this.map.createLayer('walls');
	this.map.setCollisionBetween(1, 1000, true, 'walls');
	this.map.setCollisionBetween(1, 1000, true, 'danger');
	this.walls.resizeWorld();
}


levelOneState.prototype.mouseDown = function() {
	if (this.inCutscene) {
		this.playCutscene();
	} else {
		this.tapInput.x = game.input.x + game.camera.x;
		this.tapInput.y = game.input.y + game.camera.y;
		this.pressX = game.input.x;
		this.pressY = game.input.y;
		this.willCheckOverlap = true;
	}
}

levelOneState.prototype.mouseUp = function() {
	this.selectedPlayer = false;
	this.selectedPlatform = false;
}

levelOneState.prototype.startCutscene = function(player, trigger) {
	this.checkX = trigger.position.x;
	this.checkY = 900 - (132 + 129);
	trigger.kill();
	this.inCutscene = true;
	this.player.animations.play("idle");
	this.player.body.velocity.y = 0;
	this.slowToZero = true;
	this.isJumping = false;
	this.isWalking = false;
	this.playCutscene();
}

levelOneState.prototype.tapPlayer = function() {
	this.slowToZero = true;
	this.selectedPlayer = true;
	if (this.player.body.blocked.down)
	this.player.animations.play("idle");

}

levelOneState.prototype.tapPlatform = function(tap, platform) {
	this.selectedPlatform = true;
	this.currentSelectedPlat = platform;
}

levelOneState.prototype.playCutscene = function() {
	switch(this.cutsceneIndex) {
		case 0: {
			this.textbox = game.add.sprite(this.doomsday.x - 48, this.doomsday.y + 3, "textbox");
			this.textbox.anchor.setTo(.5, 1);
			this.currentText = game.add.text(this.doomsday.x - 48, this.doomsday.y, "Ah, we meet again, Doddy! I see you've discovered my devious idea!", this.styleDoomsday);
			this.currentText.anchor.setTo(.5, 1);
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			
			this.cutsceneIndex += 1;
			let result = this.gameFunctions.findObjectsByType('cam1',this.map,'objectlayer');
			this.camSpot = game.add.sprite(result[0].x, result[0].y);
			game.camera.follow(this.camSpot, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
			this.player.animations.play("idle");
			this.player.body.velocity.y = 0;
			this.slowToZero = true;
			break;
		}
		case 1: { 
			this.currentText.setText("Don't you like it? It was delightfully converted from it's original form using my diabolical DIMENSION INVENTION!");
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 2: { 
			this.currentText.setText("Why? Don't you see, you dense dimwit? 3D movies make MONEY!");
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 3: { 
			this.currentText.setText("I mean, look at those 3D effects!");
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			this.rotatePlatform(this.platform3DGroup.children[0], 2);
			break;
		}
		case 4: { 
			this.currentText.setText("Soon all of the Cinematic Universe will be converted, and all of the civilians bones will be crushed and painfully distorted, in the name of artistic progress!");
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 5: { 
			this.currentText.setText("And there's nothing you can do to stop me. That platform is far too high for you to jump!");
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 6: { 
			this.currentText.setText("So long, you daft hero! HAHAHA!");
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 7: {
			this.cutsceneIndex += 1;
			this.inCutscene = false;
			this.currentText.kill();
			this.textbox.kill();
			this.camSpot.kill();
			game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
			this.doomsday.body.velocity.x = -300;
			this.doomsday.body.gravity.x = 800;
			this.doomsday.body.gravity.y = -100;
			break;
		} 
		case 8: {
			this.textbox = game.add.sprite(this.player.x, this.player.y - 61, "textbox");
			this.textbox.anchor.setTo(.5, 1);
			this.currentText = game.add.text(this.player.x, this.player.y - 64, '"So, you did manage to get past the jump..."', this.styleDoomsday);
			this.currentText.anchor.setTo(.5, 1);
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 9: { 
			this.currentText.setText('"So be it. But the Dimension Invention has already started to work it\'s magic here, and I am long gone, without a trace!"');
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 10: { 
			this.currentText.setText('"So unless you\'re lookin\' to lose your head, you best stay away, partner!"');
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 11: { 
			this.currentText.setText('"Go ahead. Make my day."');
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 12: { 
			this.currentText.setStyle(this.styleDoddy);
			this.currentText.setText("But Doddy knew exactly where Dr. Doomsday had gone!");
			this.textbox.height = this.currentText.height + 6;
			this.textbox.width = this.currentText.width + 6;
			this.cutsceneIndex += 1;
			break;
		}
		case 13: {
			this.cutsceneIndex += 1;
			this.inCutscene = false;
			this.currentText.kill();
			this.textbox.kill();
			//this.music.stop();
			this.levelDone = true;
			this.transition.animations.play("close");
			//game.state.start("PreloadTwoState");
			break;
		} 
	}
}



