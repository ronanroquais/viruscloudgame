var PhysicsManager = function(gameState)
{
  var MathUtils = require('../lib/MathUtils');
  var settings = require('../settings');
  var wideCanvas = require('../lib/wideCanvas');
  this.init =function(gameState)
  {

  };
  
  this.update = function(entities)
  {
    entities.forEach(function(e) {
      e.update();
    });
  }

  this.checkCollision = function(entities)
  {
    var base;
    var target;
    var nextEntities = [];
    for(base = 0; base < entities.length; base++)
    {
      nextEntities.push(entities[base]);
      if(entities[base].physicsBody.isFixed)
        continue;

      baseRect = {
        x : entities[base].physicsBody.x - entities[base].physicsBody.width/2,
        y : entities[base].physicsBody.y,
        width : entities[base].physicsBody.width,
        height : entities[base].physicsBody.height,
        canJump : entities[base].physicsBody.canJump,
        velocityX : entities[base].physicsBody.velocityX,
        velocityY : entities[base].physicsBody.velocityY,
        isFixed : entities[base].physicsBody.isFixed
      }
      
      //var canvasOverlapping = MathUtils.getXYSizeOfOverlap(entities[base].physicsBody, {x:0, y:0, width:settings.width, height: settings.height});
      baseRect.x = MathUtils.minMax(baseRect.x, 0, settings.width-baseRect.width);
      if(baseRect.y < 0)
      {
        baseRect.y = 0;
        baseRect.canJump = true;
      }
      nextEntities[base].physicsBody.x = baseRect.x + nextEntities[base].physicsBody.width/2;
      nextEntities[base].physicsBody.y = baseRect.y;
      nextEntities[base].physicsBody.velocityX = baseRect.velocityX;
      nextEntities[base].physicsBody.velocityY = baseRect.velocityY;
      nextEntities[base].physicsBody.canJump = baseRect.canJump;
    }
    for(base = 0; base < nextEntities.length; base++)
    {

      if(entities[base].physicsBody.isFixed)
        continue;

      baseRect = {
        x : entities[base].physicsBody.x - entities[base].physicsBody.width/2,
        y : entities[base].physicsBody.y,
        width : entities[base].physicsBody.width,
        height : entities[base].physicsBody.height,
        canJump : entities[base].physicsBody.canJump,
        velocityX : entities[base].physicsBody.velocityX,
        velocityY : entities[base].physicsBody.velocityY,
        isFixed : entities[base].physicsBody.isFixed
      }
//        entities[base].physicsBody.y = MathUtils.minMax(entities[base].physicsBody.y, 0, settings.height + 400 - entities[base].physicsBody.height);

      var willJump = false;
      
      for(target = 0; target < entities.length ; target++)
      {
        if(base == target)
          continue;
        targetRect = {
          x : entities[target].physicsBody.x - entities[target].physicsBody.width/2,
          y : entities[target].physicsBody.y,
          width : entities[target].physicsBody.width,
          height : entities[target].physicsBody.height,
          isFixed : entities[target].physicsBody.isFixed
        }
        if(MathUtils.areRectanglesColliding(baseRect, targetRect))
        {
          var overlappingPoint = MathUtils.getXYSizeOfOverlap(baseRect, targetRect);
          if(targetRect.isFixed)
          {
            if(Math.abs(overlappingPoint.y) > 0)
            {
              if(baseRect.y > targetRect.y)
              {
                baseRect.canJump = true;
              }
            }
          }
          else
          {
            if(baseRect.y >= targetRect.y+targetRect.width/2+1)
            {
              if(baseRect.velocityY < 0 && Math.abs(baseRect.x - targetRect.x) < baseRect.width && entities[base].owner != entities[target].owner)
              {
                gameState.entityJumpsOn(base, target);
              }
            }
          }
        }
      }
      nextEntities[base].physicsBody.canJump = baseRect.canJump;
      if(willJump)
        nextEntities[base].physicsBody.jump();
    }
    for(base = 0; base < nextEntities.length; base++)
    {

      if(entities[base].physicsBody.isFixed)
        continue;

      baseRect = {
        x : entities[base].physicsBody.x - entities[base].physicsBody.width/2,
        y : entities[base].physicsBody.y,
        width : entities[base].physicsBody.width,
        height : entities[base].physicsBody.height,
        canJump : entities[base].physicsBody.canJump,
        velocityX : entities[base].physicsBody.velocityX,
        velocityY : entities[base].physicsBody.velocityY,
        isFixed : entities[base].physicsBody.isFixed
      }

      for(target = 0; target < entities.length ; target++)
      {
        if(base == target)
          continue;
        targetRect = {
          x : entities[target].physicsBody.x - entities[target].physicsBody.width/2,
          y : entities[target].physicsBody.y,
          width : entities[target].physicsBody.width,
          height : entities[target].physicsBody.height,
          isFixed : entities[target].physicsBody.isFixed
        };
        if(MathUtils.areRectanglesColliding(baseRect, targetRect))
        {
          var overlappingPoint = MathUtils.getXYSizeOfOverlap(baseRect, targetRect);
          if(targetRect.isFixed)
          {
            if(Math.abs(overlappingPoint.y) > 0)
            {
              baseRect.velocityY = 0;
              baseRect.y -= overlappingPoint.y;
            }
            //needs to be adressed but good for proto
            else if(false && Math.abs(overlappingPoint.x) > 0)
            {
              baseRect.velocityX = 0;
              baseRect.x -= overlappingPoint.x;
            }
          }
          else
          {
            baseRect.x -= overlappingPoint.x/2;
            //baseRect.y -= overlappingPoint.y/2;
            targetRect.x += overlappingPoint.x/2;
            //targetRect.y += overlappingPoint.y/2;
          }
        }
        nextEntities[target].physicsBody.x = targetRect.x + entities[target].physicsBody.width/2;
        nextEntities[target].physicsBody.y = targetRect.y;
      }
      nextEntities[base].physicsBody.x = baseRect.x + entities[base].physicsBody.width/2;
      nextEntities[base].physicsBody.y = baseRect.y;
      nextEntities[base].physicsBody.velocityX = baseRect.velocityX;
      nextEntities[base].physicsBody.velocityY = baseRect.velocityY;
    }
    for(base = 0; base < entities.length; base++)
    {
      entities[base] = nextEntities[base];
    }
  }
};
module.exports = PhysicsManager;