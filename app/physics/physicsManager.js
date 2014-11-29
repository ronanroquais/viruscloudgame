define(function(require) {
  var PhysicsManager = function()
  {
    var MathUtils = require('lib/MathUtils');
    function update(entities)
    {
      for(var i in entities)
      {
        entities[i].update();
      }
    }

    function checkCollision(entities)
    {
      var base;
      var target;
      for(base = 0; base < entities.length; base++)
      {
        if(entities[base].isFixed)
          continue;
        for(target = 0; target < entities.length ; target++)
        {
          if(MathUtils.areRectanglesColliding(entities[base], entities[target]))
          {
            var overlappingPoint = MathUtils.getXYSizeOfOverlap(entities[base], entities[target]);
            if(entities[target].isFixed)
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