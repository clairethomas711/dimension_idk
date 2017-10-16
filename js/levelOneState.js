let levelOneState = function() {
	let sideFacing = true;
	let played = false;
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
	this.player.body.setSize(60,120,18,6);
	//this.player.body.collideWorldBounds = true;
	
	//begin temp cam code
	
	game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	
	//end temp cam code
	
	//begin platform code
	this.platform3DGroup = game.add.group();
	let result = this.gameFunctions.findObjectsByType('platform',this.map,'objectlayer');
	console.log(result.length);
	console.log(result[0]);
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
				this.platform3DGroup.children[i].frame = 0;
				break;
			}
			case this.state3D.ZbyY: {
				this.platform3DGroup.children[i].frame = 29;
				this.platform3DGroup.children[i].angle = 90;
				break;
			}
			case this.state3D.XbyZ: {
				this.platform3DGroup.children[i].frame = 14;
				break;
			}
			case this.state3D.YbyX: {
				this.platform3DGroup.children[i].frame = 44;
				break;
			}
			case this.state3D.YbyZ: {
				this.platform3DGroup.children[i].frame = 29;
				break;
			}
			case this.state3D.ZbyX: {
				this.platform3DGroup.children[i].frame = 14;
				this.platform3DGroup.children[i].angle = 90;
				break;
			}
			default: {
				break;
			}
		}
		tempPlatform3D.anchor.setTo(.5,.5);
		console.log(tempPlatform3D.state);
	}
	
	
	game.physics.arcade.enable(this.platform3DGroup);
	//end platform code
	this.player.animations.add("walk", [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
	//this.player.animations.add("right", [5, 6, 7, 8], 10, true);
	this.player.animations.add("idle", [0, 1, 2, 3, 4, 5], 10, true);
	this.player.animations.add("jump", [6, 7], 10, false);
	
	this.cursors = game.input.keyboard.createCursorKeys();
}

levelOneState.prototype.update = function() {
	game.physics.arcade.collide(this.player, this.walls);
	game.physics.arcade.collide(this.player, this.platform3DGroup);
	game.physics.arcade.collide(this.player, this.danger, this.gameFunctions.kill, null, this);
	
	// Do parallax
	this.doParallax(this);
	
	
	this.player.body.velocity.x = 0;

	if(this.player.body.velocity.y > 0) {
		this.player.frame = 7;
	} else if (this.player.body.velocity.y < 0) {
		this.player.frame = 6;
	}
	
	if(this.cursors.left.isDown) {
		this.player.scale.x = -1;
		if(this.player.body.velocity.y === 0) {
			this.player.animations.play("walk");
		}	
		this.player.body.velocity.x = -300;
		sideFacing = false;
	}
	else if(this.cursors.right.isDown) {
		this.player.scale.x = 1;
		if(this.player.body.velocity.y === 0) {
			this.player.animations.play("walk");
		}	
		this.player.body.velocity.x = 300;
		sideFacing = true;
	}
	else {
		this.player.animations.play("idle");
		//if(!sideFacing)
			//this.player.frame = 0;
		//else
			//this.player.frame = 5
	}
	
	if(this.cursors.up.isDown) {
		//this.player.animations.play("jump");
		//this.player.frame = 2;
		this.player.body.velocity.y = -400;
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

levelOneState.prototype.render = function() {
	game.debug.body(this.player);
	
	for (let i = 0; i < this.platform3DGroup.length; i++) {
		game.debug.body(this.platform3DGroup.children[i]);
	}
}

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
















