define(function(require){
  'use strict';
  var PhysicsBody = function(options)
  {
    this.x;
    this.y;
    this.width;
    this.height;
    this.velocityX;
    this.velocityY;
    this.accelerationX;
    this.accelerationY;
    this.maxVelocityX = 20;
    this.maxVelocityY = 20;
    var minRounding = 0.1;
    this.init = function(options)
    {
      for(var index in this) { 
         if (this.hasOwnProperty(index) && options.hasOwnProperty(index)) {
             this[index] = options[index];
         }
      }
/*      this.x = options.x;
      this.y = options.y;
      this.velocityX = options.velocityX;
      this.velocityY = options.velocityY;
      this.accelerationX = options.accelerationX;
      this.accelerationY = options.accelerationY;*/
    };

    this.update = function()
    {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.velocityX += this.accelerationX;
      this.velocityX = MathUtils.minMax(this.velocityX, -this.maxVelocityX, this.maxVelocityX);
      this.velocityY += this.accelerationY;
      this.velocityY = MathUtils.minMax(this.velocityY, -this.maxVelocityY, this.maxVelocityY);
      if(Math.abs(this.velocityX) < minRounding)
        this.velocityX = 0;
      if(Math.abs(this.velocityY) < minRounding)
        this.velocityY = 0;
    }
  }

  return PhysicsBody;
});