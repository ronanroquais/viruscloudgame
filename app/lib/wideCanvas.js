define(function(require) {
  'use strict';
  var settings = require('settings');
  //contextId is a string of the id of the canvas
  //settings needs 4 properties: width, height, canvasColor(bgcolor of the crop margins), backgroundColor(bgColor after clear function)
  var WideCanvas = function (settings){
    this.canvasId = settings.canvasId;
    var c = document.getElementById(this.canvasId);
    this.ctx = c.getContext('2d');
    this.scaleX = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isReady = true;

    //wrapper context
    this.clear = function()
    {
      this.ctx.clearRect(0,0, settings.width, settings.height);
      this.ctx.fillStyle= settings.canvasColor;
      this.ctx.fillRect(-settings.width, -settings.height, c.width+2*settings.width, c.height+2*settings.height);
      this.ctx.fillStyle = settings.backgroundColor;
      this.ctx.fillRect(0,0, settings.width, settings.height);
    };
    
    this.manageResize = function()
    {
      //console.log(this.scaleX+" "+this.translateX);
      this.ctx.restore();
      c.width = window.innerWidth;
      c.height = window.innerHeight;
//      c.width = settings.width;
//      c.height = settings.height;
    
      this.scaleX = c.width / (1.0 * settings.width);
      this.translateX = 0;
      this.translateY = (c.height-settings.height*this.scaleX)/2.0;
      
      if(settings.height*this.scaleX>window.innerHeight)
      {
        this.scaleX = c.height / (1.0 * settings.height);
        this.translateY = 0;
        this.translateX = (c.width - settings.width * this.scaleX)/2.0;
      }
      this.ctx.translate(this.translateX, this.translateY);
      this.ctx.scale(this.scaleX, this.scaleX);
      this.clear();
      this.clipArea();
      this.ctx.save();
    };
    this.setFullscreen = function()
    {
      this.ctx.save();
      this.manageResize();
    };

    this.clipArea = function()
    {
      this.ctx.rect(0,0,settings.width,settings.height);
      this.ctx.clip();
    };
    
    this.drawFillRect = function(x, y, width, height)
    {
      this.ctx.fillRect(x, this.getYRepereForDrawing(y, height), width, height);
    };

    this.drawStrokeRect = function(x, y, width, height)
    {
      this.ctx.strokeRect(x, this.getYRepereForDrawing(y, height), width, height);
    };

    this.getYRepereForDrawing = function(objY, objHeight)
    {
      return settings.height - objHeight - objY;
    };

    this.setFillStyle = function(color)
    {
      this.ctx.fillStyle = color;
    };
    this.getFillStyle = function()
    {
      return this.ctx.fillStyle;
    };
    this.setStrokeStyle = function(color)
    {
      this.ctx.strokeStyle = color;
    };
    this.getStrokeStyle = function()
    {
      return this.ctx.strokeStyle;
    };

    this.fillRect = function(x, y, width, height)
    {
      this.ctx.fillRect(x, y, width, height);
    };

    this.strokeRect = function(x, y, width, height)
    {
      this.ctx.strokeRect(x, y, width, height);
    };
  };
    
  function callResize()
  {
    wideCanvas.manageResize();
  }
  
  var wideCanvas = new WideCanvas(settings);
  wideCanvas.setFullscreen();
  window.onresize = callResize;

  return wideCanvas;
});