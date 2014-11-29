define(function(require) {
  var PhysicsManager = function(gameState)
  {
    var MathUtils = require('lib/MathUtils');
    var settings = require('settings');
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
      for(base = 0; base < entities.length; base++)
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
        
        //var canvasOverlapping = MathUtils.getXYSizeOfOverlap(entities[base].physicsBody, {x:0, y:0, width:settings.width, height: settings.height});
        baseRect.x = MathUtils.minMax(baseRect.x, 0, settings.width);
        if(baseRect.y < 0)
        {
          baseRect.y = 0;
          baseRect.canJump = true;
        }
        entities[base].physicsBody.x = baseRect.x + entities[base].physicsBody.width/2;
        entities[base].physicsBody.y = baseRect.y;
        entities[base].physicsBody.velocityX = baseRect.velocityX;
        entities[base].physicsBody.velocityY = baseRect.velocityY;
        entities[base].physicsBody.canJump = baseRect.canJump;
      }
      for(base = 0; base < entities.length; base++)
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
          }/*          console.log(entities[base].physicsBody);
          console.log(baseRect);
          console.log(entities[target].physicsBody);
          console.log(targetRect);
*/          
          if(MathUtils.areRectanglesColliding(baseRect, targetRect))
          {
            var overlappingPoint = MathUtils.getXYSizeOfOverlap(baseRect, targetRect);
            if(targetRect.isFixed)
            {
              if(Math.abs(overlappingPoint.y) > 0)
              {
                baseRect.velocityY = 0;
                baseRect.y -= overlappingPoint.y;
                if(baseRect.y > targetRect.y)
                {
                  baseRect.canJump = true;
                }
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
              if(baseRect.y > targetRect.y+targetRect.height/2 && overlappingPoint.x < baseRect.width/2)
              {
                gameState.entityJumpsOn(base, target);
              }
            }
          }
          entities[target].physicsBody.x = targetRect.x + entities[target].physicsBody.width/2;
          entities[target].physicsBody.y = targetRect.y;
        }
        entities[base].physicsBody.x = baseRect.x + entities[base].physicsBody.width/2;
        entities[base].physicsBody.y = baseRect.y;
        entities[base].physicsBody.velocityX = baseRect.velocityX;
        entities[base].physicsBody.velocityY = baseRect.velocityY;
        entities[base].physicsBody.canJump = baseRect.canJump;

      }
    }
  };
  return PhysicsManager;
})