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
    //returns negative value if right part of the firstRect is overlapping left part of secondRect [ 1 [ ] 2 ] = -1
    //returns positive value if left part of firstRect is overlapping right part of secondRect [ 2 [] 1 ] = + 1
    getXSizeOfOverlap : function(firstRect, secondRect)
    {
      if(firstRect.x < secondRect.x)
        return getXSizeOfOverlap(firstRect, secondRect);
      else return -1 * getXSizeOfOverlap(secondRect, firstRect);
    },
    getXLeftRightSizeOfOverlap : function(leftRect, rightRect)
    {
      var maxLeft = Math.max(leftRect.x, rightRect.x);
      var minRight = Math.min(leftRect.x+leftRect.width, rightRect.x+rightRect.width);
      var result = minRight - maxLeft;
      if(result > 0)
        return result;
      return 0;
    },
    //returns negative value if top part of the firstRect is overlapping bottom part of secondRect
    //returns positive value if bottom part of firstRect is overlapping top part of secondRect
    getYSizeOfOverlap : function(firstRect, secondRect)
    {
      if(firstRect.y < secondRect.y)
        return getYSizeOfOverlap(firstRect, secondRect);
      else return -1 * getYSizeOfOverlap(secondRect, firstRect);
    },
    getYTopBottomSizeOfOverlap : function(bottomRect, topRect)
    {
      var maxBottom = Math.max(bottomRect.y, topRect.y);
      var minTop = Math.min(bottomRect.y+bottomRect.height, topRect.y+topRect.height);
      var result = maxTop - minBottom;
      if(result > 0)
        return result;
      return 0;
    },
    getXYSizeOfOverlap : function(firstRect, secondRect)
    {
      return {
        x: getXSizeOfOverlap(firstRect, secondRect),
        y: getYSizeOfOverlap(firstRect, secondRect)
      }
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
    },
    minMax : function(value, min, max)
    {
      return Math.min(max, Math.min(max, value));
    }
  };
  return MathUtils;
});