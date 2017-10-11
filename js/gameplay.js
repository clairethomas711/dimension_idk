let gameplayState = function() {
	let sideFacing = true;
	let played = false;
	this.score = 0;
	//this.gameTime = new Phaser.Time(this.game);
	this.rotationTimer = 0;
	
	//begin enum and stuff coding
	this.state3D = { //this is important
		XbyY: 0, //X is along the screen X axis and Y is along the screen Y axis
		ZbyY: 1, //Z is along the screen X axis and Y is along the screen Y axis
		XbyZ: 2, //X is along the screen X axis and Z is along the screen Y axis
		YbyX: 3, //Y is along the screen X axis and X is along the screen Y axis
		YbyZ: 4, //Y is along the screen X axis and Z is along the screen Y axis
		ZbyX: 5 //Z is along the screen X axis and X is along the screen Y axis
	};
	this.platformStates = [0,1,2,2];
	this.platformsX = [100,200,300,400];
	this.platformsY = [100,200,300,400];
	//end enum and stuff coding
}

gameplayState.prototype.preload = function() {
	
}

gameplayState.prototype.create = function() {
	game.world.setBounds(0, 0, 5000, 900); //enable to see how camera works
	sideFacing = true;
	//game.add.sprite(0, 0, "sky");
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Create the parallaxing background and some variables for it
	this.createBackground();
	
	//Load and create the level from tiled
	this.createLevel() ;
	
	
	this.stars = game.add.group();
	this.stars.enableBody = true;
	for(let i = 0;i < 12;i++) {
		let star = this.stars.create(i * 70, 0, "star");
		star.body.gravity.y = 2000;
		star.body.bounce.y = Math.random();
	}
	
	
	//This finds where the player start is in tiled and gets the position
	let result = this.findObjectsByType('playerstart',this.map,'objectlayer');
	
	this.player = game.add.sprite(result[0].x, result[0].y, "shrek");
	game.physics.arcade.enable(this.player);
	this.player.body.gravity.y = 400;
	this.player.body.bounce.y = 0.15;
	//this.player.body.collideWorldBounds = true;
	
	//begin temp cam code
	
	game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
	
	//end temp cam code
	
	//begin platform code
	
	this.platform3DGroup = game.add.group();
	for(let i = 0;i < 4;i++)
	{
		let tempPlatform3D = this.platform3DGroup.create(this.platformsX[i], this.platformsY[i], "platform3D");
		
		/*this.platform3D = game.add.sprite(100, 100, "platform3D");
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
		
		//game.physics.arcade.enable(this.platform3D);
		this.platform3D.body.immovable = true;*/
		
		//animations from XbyY
		tempPlatform3D.animations.add("XbyYtoZbyYLeft", [0, 1], 10, false);
		tempPlatform3D.animations.add("XbyYtoZbyYRight", [0, 1], 10, false);
		tempPlatform3D.animations.add("XbyYtoXbyZLeft", [0, 2], 10, false); //in the case of a y rotation, left is up and right is down
		tempPlatform3D.animations.add("XbyYtoXbyZRight", [0, 2], 10, false);
		//animations from ZbyY
		tempPlatform3D.animations.add("ZbyYtoXbyYLeft", [1, 0], 10, false);
		tempPlatform3D.animations.add("ZbyYtoXbyYRight", [1, 0], 10, false);
		tempPlatform3D.animations.add("ZbyYtoZbyXLeft", [1, 5], 10, false);
		tempPlatform3D.animations.add("ZbyYtoZbyXRight", [1, 5], 10, false);
		//animations from XbyZ
		tempPlatform3D.animations.add("XbyZtoXbyYLeft", [2, 0], 10, false);
		tempPlatform3D.animations.add("XbyZtoXbyYRight", [2, 0], 10, false);
		tempPlatform3D.animations.add("XbyZtoYbyZLeft", [2, 4], 10, false);
		tempPlatform3D.animations.add("XbyZtoYbyZRight", [2, 4], 10, false);
		//animations from YbyX
		tempPlatform3D.animations.add("YbyXtoZbyXLeft", [3, 5], 10, false);
		tempPlatform3D.animations.add("YbyXtoZbyXRight", [3, 5], 10, false);
		tempPlatform3D.animations.add("YbyXtoYbyZLeft", [3, 4], 10, false);
		tempPlatform3D.animations.add("YbyXtoYbyZRight", [3, 4], 10, false);
		//animations from YbyZ
		tempPlatform3D.animations.add("YbyZtoYbyXLeft", [4, 3], 10, false);
		tempPlatform3D.animations.add("YbyZtoYbyXRight", [4, 3], 10, false);
		tempPlatform3D.animations.add("YbyZtoXbyZLeft", [4, 2], 10, false);
		tempPlatform3D.animations.add("YbyZtoXbyZRight", [4, 2], 10, false);
		//animations from ZbyX
		tempPlatform3D.animations.add("ZbyXtoYbyXLeft", [5, 3], 10, false);
		tempPlatform3D.animations.add("ZbyXtoYbyXRight", [5, 3], 10, false);
		tempPlatform3D.animations.add("ZbyXtoZbyYLeft", [5, 1], 10, false);
		tempPlatform3D.animations.add("ZbyXtoZbyYRight", [5, 1], 10, false);
	
		game.physics.arcade.enable(tempPlatform3D);
		tempPlatform3D.body.immovable = true;
		setPlatformPhysics(tempPlatform3D, pos);
		//set visual to line up
	}
	
	game.physics.arcade.enable(this.platform3DGroup);
	//end platform code
	this.player.animations.add("left", [0, 1, 2, 3], 10, true);
	this.player.animations.add("right", [5, 6, 7, 8], 10, true);
	
	this.scoreText = game.add.text(16, 16, "Score: 0", {fontSize: "32pt", fill: "#000000"});
	
	this.cursors = game.input.keyboard.createCursorKeys();
}

gameplayState.prototype.update = function() {
	game.physics.arcade.collide(this.player, this.walls);
	game.physics.arcade.collide(this.stars, this.walls);
	game.physics.arcade.collide(this.player, this.platform3DGroup);
	
	// Do parallax
	this.doParallax(this);
	
	
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
	
	if(this.cursors.up.isDown) {
		this.player.body.velocity.y = -400;
	}
	
	//begin platform code
	let dir = 0;
	if(this.cursors.up.isDown && !this.rotating) //INSERT TIME DELAY AAAAAAA
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
		for(let i = 0;i < 4;i++)
			this.rotatePlatform(i, dir);
		this.rotationTimer = game.time.totalElapsedSeconds();
	}
	if((game.time.totalElapsedSeconds() - this.rotationTimer) >= 2)
	{
		this.rotating = false;
		this.rotationTimer = 0;
	}
	//end platform code
}

gameplayState.prototype.rotatePlatform = function(pos, input) {
	let caseFailure = false;
	switch(platformStates[pos]) {
		case this.state3D.XbyY: {
			switch(input) { //0 = up/north, 1 = right/east, 2 = down/south, 3 = left/west
				case 0: {
					this.platform3D.animations.play("XbyYtoXbyZLeft", false);
					this.platformState = this.state3D.XbyZ;
					
					break;
				}
				case 1: {
					this.platform3D.animations.play("XbyYtoZbyYRight", false);
					this.platformState = this.state3D.ZbyY;
					
					break;
				}
				case 2: {
					this.platform3D.animations.play("XbyYtoXbyZRight", false);
					this.platformState = this.state3D.XbyZ;
					
					break;
				}
				case 3: {
					this.platform3D.animations.play("XbyYtoZbyYLeft", false);
					this.platformState = this.state3D.ZbyY;
					
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
					this.platform3D.animations.play("ZbyYtoZbyXLeft", false);
					this.platformState = this.state3D.ZbyX;
					
					break;
				}
				case 1: {
					this.platform3D.animations.play("ZbyYtoXbyYRight", false);
					this.platformState = this.state3D.XbyY;
					
					break;
				}
				case 2: {
					this.platform3D.animations.play("ZbyYtoZbyXRight", false);
					this.platformState = this.state3D.ZbyX;
					
					break;
				}
				case 3: {
					this.platform3D.animations.play("ZbyYtoXbyYLeft", false);
					this.platformState = this.state3D.XbyY;
					
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
					this.platform3D.animations.play("XbyZtoXbyYLeft", false);
					this.platformState = this.state3D.XbyY;
					break;
				}
				case 1: {
					this.platform3D.animations.play("XbyZtoYbyZRight", false);
					this.platformState = this.state3D.YbyZ;
					break;
				}
				case 2: {
					this.platform3D.animations.play("XbyZtoXbyYRight", false);
					this.platformState = this.state3D.XbyY;
					break;
				}
				case 3: {
					this.platform3D.animations.play("XbyZtoYbyZLeft", false);
					this.platformState = this.state3D.YbyZ;
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
					this.platform3D.animations.play("YbyXtoYbyZLeft", false);
					this.platformState = this.state3D.YbyZ;
					break;
				}
				case 1: {
					this.platform3D.animations.play("YbyXtoZbyXRight", false);
					this.platformState = this.state3D.ZbyX;
					break;
				}
				case 2: {
					this.platform3D.animations.play("YbyXtoYbyZRight", false);
					this.platformState = this.state3D.YbyZ;
					break;
				}
				case 3: {
					this.platform3D.animations.play("YbyXtoZbyXLeft", false);
					this.platformState = this.state3D.ZbyX;
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
					this.platform3D.animations.play("YbyZtoYbyXLeft", false);
					this.platformState = this.state3D.YbyX;
					break;
				}
				case 1: {
					this.platform3D.animations.play("YbyZtoXbyZRight", false);
					this.platformState = this.state3D.XbyZ;
					break;
				}
				case 2: {
					this.platform3D.animations.play("YbyZtoYbyXRight", false);
					this.platformState = this.state3D.YbyX;
					break;
				}
				case 3: {
					this.platform3D.animations.play("YbyZtoXbyZLeft", false);
					this.platformState = this.state3D.XbyZ;
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
					this.platform3D.animations.play("ZbyXtoZbyYLeft", false);
					this.platformState = this.state3D.ZbyY;
					break;
				}
				case 1: {
					this.platform3D.animations.play("ZbyXtoYbyXRight", false);
					this.platformState = this.state3D.YbyX;
					break;
				}
				case 2: {
					this.platform3D.animations.play("ZbyXtoZbyYRight", false);
					this.platformState = this.state3D.ZbyY;
					break;
				}
				case 3: {
					this.platform3D.animations.play("ZbyXtoYbyXLeft", false);
					this.platformState = this.state3D.YbyX;
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
}

gameplayState.prototype.setPlatformPhysics = function(platform, state) {
		state = this.platformState;
		switch(state) {
			case this.state3D.XbyY: {
				this.platform3D.body.setSize(256,128,0,64);
				break;
			}
			case this.state3D.ZbyY: {
				this.platform3D.body.setSize(64,128,96,64);
				break;
			}
			case this.state3D.XbyZ: {
				this.platform3D.body.setSize(256,64,0,96);
				break;
			}
			case this.state3D.YbyX: {
				this.platform3D.body.setSize(128,256,64,0);
				break;
			}
			case this.state3D.YbyZ: {
				this.platform3D.body.setSize(128,64,64,96);
				break;
			}
			case this.state3D.ZbyX: {
				this.platform3D.body.setSize(64,256,96,0);
				break;
			}
			default: {
				break;
			}
		}
	}


gameplayState.prototype.createBackground = function() {
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

gameplayState.prototype.doParallax = function() {
	this.sky.tilePosition.x -= 0.2;
	this.mtn1.tilePosition.x = game.camera.x * -0.2;
	this.mtn2.tilePosition.x = game.camera.x * -0.35;
	this.tree1.tilePosition.x = game.camera.x * -0.5;
	this.tree2.tilePosition.x = game.camera.x * -0.7;
	
}

gameplayState.prototype.createLevel = function() {
	this.map = this.game.add.tilemap('level1');
	this.map.addTilesetImage('tiletest', 'level1tiles');
	
	this.background = this.map.createLayer('background');
    this.walls = this.map.createLayer('walls');
	this.map.setCollisionBetween(1, 100, true, 'walls');
	this.walls.resizeWorld();
}

gameplayState.prototype.findObjectsByType = function(type, map, layer) {
    let result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
}
















