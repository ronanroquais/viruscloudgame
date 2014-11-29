define(function(require) {
  'use strict';
  var wideCanvas = require('lib/wideCanvas');
  var isMouseDown = false;
  var mouseX;
  var mouseY;
//  var clicked = false;

  $(wideCanvas.canvasId).mousemove(function(e)
  {
    if(wideCanvas.isReady)
    {
      mouseX = (e.pageX-wideCanvas.translateX) / wideCanvas.scaleX;
      mouseY = (e.pageY-wideCanvas.translateY) / wideCanvas.scaleX;
    }
  });
  $(wideCanvas.canvasId).mousedown(function()
  {
    isMouseDown = true;
  });
  $(wideCanvas.canvasId).mouseup(function()
  {
    if(isMouseDown)
    {
      isMouseDown = false;
    }
  });
  $(wideCanvas.canvasId).click(function()
  {
//    clicked = true;
  });
});