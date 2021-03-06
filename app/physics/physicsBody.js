'use strict';
var settings = require('../settings');
var MathUtils = require('../lib/MathUtils');

var PhysicsBody = function(options)
{
  console.log(options);
  options = options || {};
  if(options.x == undefined)
    options.x = settings.width/2;
  if(options.y == undefined)
    options.y = settings.height/4;
  this.x = options.x;
  this.y = options.y;
  this.width = options.width || 32;
  this.height = options.height || 48;
  this.velocityX = 0;
  this.velocityY = 0;
  this.accelerationX = 0.0;
  this.isFixed = options.isFixed ? true : false;
  this.accelerationY = this.isFixed ? 0 : settings.gravity;
  this.maxVelocityX = 12;
  this.maxVelocityY = 20;
  this.canJump = true;
  var jumpStart =0;

  var minRounding = 0.1;
  this.init = function(options)
  {
  };
  this.moveLeft = function ()
  {
    this.accelerationX = -settings.runAccel;
    //this.accelerationX = -this.velocityX/2;
  }
  this.moveRight = function ()
  {
    //this.velocityX = settings.runVelocity;
    this.accelerationX = settings.runAccel;
  }
  this.noMove = function ()
  {
    this.accelerationX = -this.velocityX/2; 
  }
  this.jump = function()
  {
    if(this.canJump || jumpStart < 3)
    {
      if(this.canJump)
        jumpStart = 0;
      this.canJump = false;
      this.velocityY = settings.jumpVelocity;
    }
  }
  this.noJump = function()
  {
    if(this.velocityY >= settings.jumpVelocity)
    {
      this.velocityY /=1.5;
    }
  }

  this.update = function()
  {
    if(jumpStart < 3)
      jumpStart++;
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
    //no need to tweak gravity :>
    //if(Math.abs(this.accelerationY) < minRounding)
    //  this.accelerationY = 0
    //else this.accelerationY /= 2;
  }
}

module.exports = PhysicsBody;