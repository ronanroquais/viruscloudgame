define(function(require){
  'use strict';
  var settings = require('settings');
  var MathUtils = require('lib/MathUtils');

  var PhysicsBody = function(options)
  {
    options = options || {};
    if(options.x == undefined)
      options.x = settings.width/2;
    if(options.y == undefined)
      options.y = settings.height/4;
    this.x = options.x;
    this.y = options.y;
    this.width = options.width || 32;
    this.height = options.width || 48;
    this.velocityX = 0;
    this.velocityY = 0;
    this.accelerationX = 0.0;
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
      this.accelerationX = -this.velocityX/2;
    }
    this.moveRight = function ()
    {
      this.velocityX = settings.runVelocity;
      this.accelerationX = -this.velocityX/2;
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
      if(Math.abs(this.accelerationX) < minRounding)
        this.accelerationX = 0
      else this.accelerationX /= 2;
      var tmpVY = this.velocityY + this.accelerationY;
      tmpVY = MathUtils.minMax(tmpVY, -this.maxVelocityY, this.maxVelocityY);
      if(Math.abs(tmpVY) < minRounding)
        tmpVY = 0;
      this.velocityY = tmpVY;
      if(Math.abs(this.accelerationY) < minRounding)
        this.accelerationY = 0
      else this.accelerationY /= 2;
    }
  }

  return PhysicsBody;
});