let levelOneState = function() {
	let sideFacing = true;
	let played = false;
	let mouseDown = false;
	let tapMade = false;
	let goingLeft = false;
	let goingRight = false;
	let midJump = false;
	
	let pressX = 0;
	let pressY = 0;
	let liftX = 0;
	let liftY = 0;

	let pressDuration = 0;
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
	this.styleDoddy = { font: "16px Arial", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: 192 };
	this.styleDoomsday = { font: "16px Arial", fill: "#000000", align: "center", wordWrap: true, wordWrapWidth: 192 };
}

levelOneState.prototype.preload = function() {
	
}

levelOneState.prototype.create = function() {
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
	this.player.body.gravity.y = 400;
	//this.player.body.bounce.y = 0.15;
	this.player.anchor.setTo(.5,.5);
	this.player.body.setSize(60,120,24,12);
	//this.player.body.collideWorldBounds = true;
	
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
		tempPlatform3D.anchor.setTo(.5,.5);
	}
	
	
	game.physics.arcade.enable(this.platform3DGroup);
	//end platform code
	this.player.animations.add("walk", [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
	//this.player.animations.add("right", [5, 6, 7, 8], 10, true);
	this.player.animations.add("idle", [0, 1, 2, 3, 4, 5], 10, true);
	this.player.animations.add("jump", [6, 7], 10, false);
	
	this.player.inputEnabled = true;
	this.player.events.onInputDown.add(this.clickPlayer, this);
	
	this.cursors = game.input.keyboard.createCursorKeys();
	
	///////////////////
	// Cutscene Code //
	///////////////////
	game.input.onDown.add(this.mouseDown, this);
	//game.input.onUp.add(this.mouseUp, this);
	
	this.triggerGroup = game.add.group();
	let triggers = this.gameFunctions.findObjectsByType('cutscene',this.map,'objectlayer');
	console.log(triggers.length);
	for(let i = 0;i < triggers.length;i++) {
		let tempTrigger = this.triggerGroup.create(triggers[i].x, triggers[i].y);
		game.physics.arcade.enable(tempTrigger);
		tempTrigger.body.setSize(64,750,0,0);
	}
	result = this.gameFunctions.findObjectsByType('doomsday',this.map,'objectlayer');
	this.doomsday = game.add.sprite(result[0].x, result[0].y, "doomsday");
	this.doomsday.animations.add("idle", [1, 2, 3, 4, 5, 6, 7, 8], 10, true);
	this.doomsday.animations.play("idle");
	this.doomsday.scale.x = -1;
	game.physics.arcade.enable(this.doomsday);
	
}

levelOneState.prototype.update = function() {
	
	game.physics.arcade.collide(this.player, this.walls);
	game.physics.arcade.collide(this.player, this.platform3DGroup);
	game.physics.arcade.collide(this.player, this.danger, this.gameFunctions.kill, null, this);
	game.physics.arcade.overlap(this.player, this.triggerGroup, this.startCutscene, null, this);
	
	if (this.doomsday.x > 4000) {
		this.doomsday.kill();
	}
	
	// Do parallax
	this.doParallax(this);
	
	this.player.body.onCollide = new Phaser.Signal();
	this.player.body.onCollide.add(this.onGround, this);
		
	// mouseDown should only record the first position
	if (game.input.mousePointer.isDown) {
		if (!(this.mouseDown)) {
			this.pressX = game.input.mousePointer.screenX;
			this.pressY = game.input.mousePointer.screenY;
		}
		this.mouseDown = true;
		this.tapMade = true;
		this.pressDuration = game.input.mousePointer.duration;
	}
	else if (game.input.mousePointer.isUp) {
		// A tap (click/drag was made)
		if (this.tapMade) {
			this.liftX = game.input.mousePointer.screenX;
			this.liftY = game.input.mousePointer.screenY;
			// Drag
			if (this.pressDuration > 100) {
				// Swipe right
				if (this.liftX > this.pressX) {
					this.player.scale.x = 1;
					// Jump
					if ((this.liftY - this.pressY) < 0 && Math.abs(this.liftY - this.pressY) > (this.liftX - this.pressX)) {
						//if (!this.midJump) {
							this.player.animations.play("jump");
							this.player.frame = 2;
							this.player.body.velocity.y = -400;
							this.player.body.velocity.x = 300;
							this.midJump = true;
						//}
					}
					else {
						game.debug.text( "STOOOOOOOOOOOOOOOp", 100, 450 );
						this.player.body.velocity.x = 300;
						this.player.animations.play("walk");
					}
				}
				// Swipe left
				else if (this.liftX < this.pressX) {
					this.player.scale.x = -1;
					// Jump
					if ((this.liftY - this.pressY) < 0 && Math.abs(this.liftY - this.pressY) > Math.abs(this.liftX - this.pressX)) {
						//if (!this.midJump) {
							this.player.animations.play("jump");
							this.player.frame = 2;
							this.player.body.velocity.y = -400;
							this.player.body.velocity.x = 300;
							this.midJump = true;
						//}
					}
					this.player.body.velocity.x = -300;
					this.player.animations.play("walk");
				}
				// Swipe directly up
				else {
					// Jump
					if ((this.liftY - this.pressY) < 0) {
						//if (!this.midJump) {
							this.player.animations.play("jump");
							this.player.frame = 2;
							this.player.body.velocity.y = -400;
							this.player.body.velocity.x = 300;
							this.midJump = true;
						//}
					}
				}
			}
		}
		this.pressDuration = 0;
		this.tapMade = false;
		this.mouseDown = false;
	}
	else {
		this.pressDuration = 0;
	}
		
		
		
		//begin platform code
		let dir = 0; //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
		if(this.cursors.up.isDown && !this.rotating)
		{
			dir = 0;
			this.rotating = true;
		}
		if(this.cursors.right.isDown && !this.rotating)
		{
			dir = 1;
			this.rotating = true;
		}
		if(this.cursors.down.isDown && !this.rotating)
		{
			dir = 2;
			this.rotating = true;
		}
		if(this.cursors.left.isDown && !this.rotating)
		{
			dir = 3;
			this.rotating = true;
		}
		if(this.rotating && this.rotationTimer == 0) {
			this.platform3DGroup.forEach(this.rotatePlatform, this, true, dir);
			this.rotationTimer = game.time.totalElapsedSeconds();
		}
		if((game.time.totalElapsedSeconds() - this.rotationTimer) >= 2)
		{
			this.rotating = false;
			this.rotationTimer = 0;
		}
		//end platform code
		
		//begin switching level code
		this.az = 0;
		if(this.az == 1)//UPON REACH END
		{
			//StateManager sm = new StateManager(this);
			game.state.start("PreloadTwoState");
			//sm.start("Preload2State");
			this.az++;
		}
		
		//end switching level code

	}
//}

/*
levelOneState.prototype.render = function() {
	game.debug.body(this.player);
	
	for (let i = 0; i < this.platform3DGroup.length; i++) {
		game.debug.body(this.platform3DGroup.children[i]);
	}
	for (let i = 0; i < this.triggerGroup.length; i++) {
		game.debug.body(this.triggerGroup.children[i]);
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
					plat.angle = 270;
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
					plat.angle = 90;
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
					plat.angle = 90;
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
					plat.angle = 270;
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
	else
		this.setPlatformPhysics(plat);
}

levelOneState.prototype.setPlatformPhysics = function(plat) {
	platState = plat.state;
	switch(platState) {
		case this.state3D.XbyY: {
			plat.body.setSize(256,64,0,96);
			break;
		}
		case this.state3D.ZbyY: {
			plat.body.setSize(128,64,64,96);
			break;
		}
		case this.state3D.XbyZ: {
			plat.body.setSize(256,128,0,64);
			break;
		}
		case this.state3D.YbyX: {
			plat.body.setSize(64,256,96,0);
			break;
		}
		case this.state3D.YbyZ: {
			plat.body.setSize(64,128,96,64);
			break;
		}
		case this.state3D.ZbyX: {
			plat.body.setSize(128,256,64,0);
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



/*levelOneState.prototype.findObjectsByType = function(type, map, layer) {
    let result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
}*/


levelOneState.prototype.mouseDown = function() {
	if (this.inCutscene) {
		this.playCutscene();
	} else {
		
	}
}

levelOneState.prototype.startCutscene = function(player, trigger) {
	this.checkX = trigger.x;
	this.checkY = 256;
	trigger.kill();
	this.inCutscene = true;
	this.player.animations.play("idle");
	this.player.body.velocity.y = 0;
	this.playCutscene();
}

levelOneState.prototype.playCutscene = function() {
	switch(this.cutsceneIndex) {
		case 0: {
			this.currentText = game.add.text(this.doomsday.x - 48, this.doomsday.y, "Ah, we meet again, Doddy! I see you've discovered my devious idea!", this.styleDoomsday);
			this.currentText.anchor.setTo(.5, 1);
			this.cutsceneIndex += 1;
			let result = this.gameFunctions.findObjectsByType('cam1',this.map,'objectlayer');
			this.camSpot = game.add.sprite(result[0].x, result[0].y);
			game.camera.follow(this.camSpot, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
			break;
		}
		case 1: { 
			this.currentText.setText("Don't you like it? It was delightfully converted from it's original form using my diabolical DIMENSION INVENTION!")
			this.cutsceneIndex += 1;
			break;
		}
		case 2: { 
			this.currentText.setText("Why? Don't you see, you dense dimwit? 3D movies make MONEY!")
			this.cutsceneIndex += 1;
			break;
		}
		case 3: { 
			this.currentText.setText("I mean, look at those 3D effects!")
			this.cutsceneIndex += 1;
			this.rotatePlatform(this.platform3DGroup.children[0], 2);
			break;
		}
		case 4: { 
			this.currentText.setText("Soon all of the Cinematic Universe will be converted, and all of the civilians bones will be crushed and painfully distorted, in the name of artistic progress!");
			this.cutsceneIndex += 1;
			break;
		}
		case 5: { 
			this.currentText.setText("And there's nothing you can do to stop me. That platform is far too high for you to jump!");
			this.cutsceneIndex += 1;
			break;
		}
		case 6: { 
			this.currentText.setText("So long, you daft hero! HAHAHA!")
			this.cutsceneIndex += 1;
			break;
		}
		case 7: {
			this.cutsceneIndex += 1;
			this.inCutscene = false;
			this.currentText.kill();
			this.camSpot.kill();
			game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
			this.doomsday.body.velocity.x = -300;
			this.doomsday.body.gravity.x = 800;
			this.doomsday.body.gravity.y = -100;
			break;
		} 
		case 8: {
			this.currentText = game.add.text(this.player.x, this.player.y - 64, '"So, you did manage to get past the jump..."', this.styleDoomsday);
			this.currentText.anchor.setTo(.5, 1);
			this.cutsceneIndex += 1;
			break;
		}
		case 9: { 
			this.currentText.setText('"So be it. But the Dimension Invention has already started to work it\'s magic here, and I am long gone, without a trace!"');
			this.cutsceneIndex += 1;
			break;
		}
		case 10: { 
			this.currentText.setText('"So unless you\'re lookin\' to lose your head, you best stay away, partner!"');
			this.cutsceneIndex += 1;
			break;
		}
		case 11: { 
			this.currentText.setText('"Go ahead. Make my day."');
			this.cutsceneIndex += 1;
			break;
		}
		case 12: { 
			this.currentText.setText("But Doddy knew exactly where Dr. Doomsday had gone!");
			this.cutsceneIndex += 1;
			break;
		}
		case 13: {
			this.cutsceneIndex += 1;
			this.inCutscene = false;
			this.currentText.kill();
			break;
		} 
	}
}


levelOneState.prototype.clickPlayer = function() {
	this.player.body.velocity.x = 0;
	//game.physics.arcade.accelerateToPointer(this.player, game.input.mousePointer, 0, 0);
	this.player.animations.play("idle");
}

levelOneState.prototype.onGround = function() {
	this.midJump = false;
}

