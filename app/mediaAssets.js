define(function(){

  var none = new Image();
  var blue = new Image();
  blue.src = "img/blue.png";
  var green = new Image();
  green.src = "img/green.png";
  var turquoise = new Image();
  turquoise.src = "img/turquoise.png";
  var red = new Image();
  red.src = "img/red.png";
  var purple = new Image();
  purple.src = "img/purple.png";
  var yellow = new Image();
  yellow.src = "img/yellow.png";
  var white = new Image();
  white.src = "img/white.png";

  var mediaAssets = {
  	blocks : [none, blue, green, turquoise, red, purple, yellow, white]
  }
  return mediaAssets;
});