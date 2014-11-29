define(function(require){
  'use strict';
  var settings = require('settings');

  var PhysicsBody = function(options)
  {
    this.x = options.x || settings.width/2;
    this.y = options.y || settings.height/4;
    this.width = options.width || 32;
    this.height = options.width || 48;
    this.velocityX = 0;
    this.velocityY = 0;
    this.accelerationX = 0.1;
    this.accelerationY = settings.gravity;
    this.maxVelocityX = 20;
    this.maxVelocityY = 20;
    var minRounding = 0.1;
    this.init = function(options)
    {
    };
    this.moveLeft = function ()
    {
      this.velocityX = -settings.runVelocity;
    }
    this.moveRight = function ()
    {
      this.velocityX = settings.runVelocity;
    }
    this.jump = function()
    {
      this.velocityY = settings.jumpVelocity;
    }

    this.update = function()
    {
      this.x += this.velocityX;
      this.y += this.velocityY;
      var tmpVX = this.velocityX + this.accelerationX;
      tmpVX = MathUtils.minMax(tmpVX, -this.maxVelocityX, this.maxVelocityX);
      if(Math.abs(tmpVX) < minRounding)
        tmpVX = 0;
      this.velocityX = tmpVX;
      var tmpVX = this.velocityY + this.accelerationY;
      tmpVY = MathUtils.minMax(tmpVX, -this.maxVelocityY, this.maxVelocityY);
      if(Math.abs(tmpVY) < minRounding)
        tmpVY = 0;
      this.velocityY = tmpVY;
    }
  }

  return PhysicsBody;
});