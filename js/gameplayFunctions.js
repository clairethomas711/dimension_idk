//This file will hold all functions not dependent upon levels
let gameplayFunctions = function() {
	
}

gameplayFunctions.prototype.findObjectsByType = function(type, map, layer) {
    let result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
}

gameplayFunctions.prototype.rotatePlatform = function(plat, input) {
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

gameplayFunctions.prototype.setPlatformPhysics = function(plat) {
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
	
gameplayFunctions.prototype.kill = function(player) {
	player.kill();
}
	
	