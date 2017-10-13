let creditState = function() {
	this.finOffset = 400;
	this.scrollSpeed = 1.5;
}

creditState.prototype.preload = function() {
	
}

creditState.prototype.create = function() {
	game.stage.backgroundColor = '#000000';
	
	// Load in the text and set the style
	let rawtext = game.cache.getText('Credits');
	let style = { font: "bold 64px Arial", fill: "#ffffff", align: "center"};
	//Add in and position the text
	credits = game.add.text(667, 750, rawtext, style);
	credits.anchor.setTo(.5, 0);
}

creditState.prototype.update = function() {
	if ((credits.height + credits.y - this.finOffset) > 0)
		credits.y -= this.scrollSpeed;
}












