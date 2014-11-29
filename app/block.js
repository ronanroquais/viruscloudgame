define(function(require)
{
  'use strict';
  var settings = require('settings');
  var properties = require('properties');
  var wideCanvas = require('lib/wideCanvas');
  var mediaAssets = require('mediaAssets');

  // Fighter class
  var Block = function(options)
  {
    this.x = options.x;
    this.y = options.y;
    this.velocityX = options.velocityX || 0;
    this.velocityY = options.velocityY || 0;
    this.accelerationX = 0;
    this.accelerationY = options.accelerationY || 0;
    this.color = options.color || "#E00";
    this.colorValue = options.colorValue || 1;
    this.sprite = options.sprite || mediaAssets.blocks[this.colorValue];
    this.width = options.width || 32;
    this.height = options.height || 32;
    this.state = 0; // Change: 0: standing, 1: stop
    this.animationFrame = 0;
    this.speed = options.speed || 1;
    this.beenPassed = false;
    this.internalCounter=0;
    this.isMovable = options.isMovable || false;
  };
  Block.prototype.fall = function()
  {
    this.velocityY = this.speed * settings.fallSpeed;
  }
  Block.prototype.speedyFall = function()
  {
    this.velocityY = this.speed * settings.fallSpeed * 2;
  }
  Block.prototype.isSpeedyFalling = function()
  {
    return this.velocityY > this.speed*settings.fallSpeed;
  }
  Block.prototype.stopFalling = function ()
  {
    this.velocityY = 0;
  }
  Block.prototype.draw = function () 
  {
    if(this.sprite)
    {
      wideCanvas.ctx.drawImage(this.sprite, this.animationFrame * this.width, 0, this.width*2, this.height*2, this.x, this.y, this.width, this.height);
    }
    else
    {
      wideCanvas.ctx.fillStyle = this.color;
      wideCanvas.fillRect(this.x, this.y, this.width, this.height);
      if(this.isMovable)
      {
        if(this.nextBlink === true)
        {
          wideCanvas.ctx.strokeStyle = "#222";
          this.nextBlink = false;
        }
        else wideCanvas.ctx.strokeStyle = "#FFF";
        
        wideCanvas.strokeRect(this.x, this.y, this.width, this.height);
      }
      //wideCanvas.ctx.font="16px Arial";
      //wideCanvas.ctx.textAlign = "center";
      //wideCanvas.ctx.fillStyle = "#222";
      //wideCanvas.ctx.fillText(("000"+this.colorValue.toString(2)).substr(-3, 3), this.x+ this.width/2, this.y + 6 + this.height/2);
      wideCanvas.ctx.fillStyle = "#222";
      var res = this.colorValue & 4;
      if( res == 4)
      {
        wideCanvas.ctx.fillStyle = "#FFF";
      wideCanvas.ctx.fillRect(this.x -1+ this.width/4, this.y, 2, this.height);
      }

      wideCanvas.ctx.fillStyle = "#222";
      res = this.colorValue & 2;
      if(res == 2)
      {
        wideCanvas.ctx.fillStyle = "#FFF";
      wideCanvas.ctx.fillRect(this.x -1+ 2*this.width/4, this.y, 2, this.height);
      }
      wideCanvas.ctx.fillStyle = "#222";
      res = this.colorValue & 1;
      if(res == 1)
      {
        wideCanvas.ctx.fillStyle = "#FFF";
      wideCanvas.ctx.fillRect(this.x -1+ 3*this.width/4, this.y, 2, this.height);
      }
      //wideCanvas.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  Block.prototype.blink = function() {
    this.nextBlink = true;
  };
  Block.prototype.update = function() {
    if(this.state == 1)
      return;

    if(this.animationFrame>=1)
    {
      this.internalCounter++;
      if(this.internalCounter>=10)
      {
        this.internalCounter = 0;
        this.animationFrame = 0;
        console.log("reset");
      }
    }
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityX += this.accelerationX;
    this.velocityY += this.accelerationY;
//      this.x = Math.min(Math.max(this.x, this.width/2), settings.width-this.width/2);
//      this.y = Math.min(Math.max(this.y, this.height/2), settings.height-this.height/2);
  };
  
  return Block;
});