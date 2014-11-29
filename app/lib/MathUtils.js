define(function(){
  'use strict';
  // uniquement des méthodes statiques kthx
  // Une fonction ici doit avoir des tests unitaires
  var MathUtils = {
    ruleOfThree : function(i1, j1, j2) {
      return i1*j2/j1;
    },
    ruleOfThreeX : function (x1, y1, y2) {
      return MathUtils.ruleOfThree(x1, y1, y2);
    },
    ruleOfThreeY : function (x1, y1, x2) {
      return MathUtils.ruleOfThree(y1, x1, x2);
    },
    areRectanglesColliding : function(firstRect, secondRect)
    {
      return MathUtils.isPointInRectangle(firstRect, secondRect)
      || MathUtils.isPointInRectangle({x:firstRect.x+firstRect.width, y: firstRect.y}, secondRect)
      || MathUtils.isPointInRectangle({x:firstRect.x, y: firstRect.y+firstRect.height}, secondRect)
      || MathUtils.isPointInRectangle({x:firstRect.x+firstRect.width, y: firstRect.y+firstRect.height}, secondRect);
    },
    isPointInRectangle : function(point, rectangle)
    {
      return point.x >= rectangle.x && point.x <= rectangle.x + rectangle.width
              && point.y >= rectangle.y && point.y <= rectangle.y + rectangle.height;
    },
    getXSizeOfOverlap : function(firstRect, secondRect)
    {
      var maxLeft = Math.max(firstRect.x, secondRect.x);
      var minRight = Math.min(firstRect.x+firstRect.width, secondRect.x+secondRect.width);
      var result = minRight - maxLeft;
      if(result > 0)
        return result;
      return 0;
    },
    getYSizeOfOverlap : function(firstRect, secondRect)
    {
      var maxTop = Math.max(firstRect.y, secondRect.y);
      var minBottom = Math.min(firstRect.y+firstRect.height, secondRect.y+secondRect.height);
      var result = minBottom - maxTop;
      if(result > 0)
        return result;
      return 0;
    },
    // Thales <3
    getYFromXOnLineFormedByTwoPoints : function(wantedX, originX, originY, destX, destY)
    {
      if(originX > destX)
        return MathUtils.getYFromXOnLineFormedByTwoPoints(wantedX, destX, destY, originX, originY);
      var normedX = destX - originX;
      var normedY = destY - originY;
      var normedWantedX = wantedX - originX;
      
      var normedResultY = (normedWantedX / normedX) * normedY;
      return normedResultY + originY;
    }
  };
  return MathUtils;
});