define(function(require) {
  var PhysicsManager = function()
  {
    var MathUtils = require('lib/MathUtils');
    var settings = require('settings');
    this.init =function()
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

        //var canvasOverlapping = MathUtils.getXYSizeOfOverlap(entities[base].physicsBody, {x:0, y:0, width:settings.width, height: settings.height});
        entities[base].physicsBody.x = MathUtils.minMax(entities[base].physicsBody.x, 0, settings.width - entities[base].physicsBody.width);
        entities[base].physicsBody.y = MathUtils.minMax(entities[base].physicsBody.y, 0, settings.height + 400 - entities[base].physicsBody.height);

        for(target = 0; target < entities.length ; target++)
        {
          if(base == target)
            continue;
          
          if(MathUtils.areRectanglesColliding(entities[base].physicsBody, entities[target].physicsBody))
          {
            var overlappingPoint = MathUtils.getXYSizeOfOverlap(entities[base].physicsBody, entities[target].physicsBody);
            if(entities[target].physicsBody.isFixed)
            {
              if(Math.abs(overlappingPoint.x) > 0)
              {
                entities[base].physicsBody.velocityX = 0;
                entities[base].physicsBody.x -= overlappingPoint.x;
              }
              if(Math.abs(overlappingPoint.y) > 0)
              {
                entities[base].physicsBody.velocityY = 0;
                entities[base].physicsBody.y -= overlappingPoint.y;              
              }
            }
            else
            {
              entities[base].physicsBody.x -= overlappingPoint.x/2;
              entities[base].physicsBody.y -= overlappingPoint.y/2;
            }
          }
        }
      }
    }
  };
  return PhysicsManager;
})