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