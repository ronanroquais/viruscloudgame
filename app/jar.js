'use-strict'
var Block = require('./block');
var wideCanvas = require('./lib/wideCanvas');
var MathUtils = require("./lib/MathUtils");
var settings = require('./settings');

var Jar = function (options) 
{
  this.isAlive = false;
  this.gameObjects = [];
  this.rows = 13;
  this.cols = 8;
  this.x = options.x;
  this.y = options.y;
  this.itemSize = 32;
  this.offsetX = this.offsetY = 0;
  this.innerCounter = 0;
  this.blinkCounter = 0;
  this.width = this.cols * (this.itemSize + this.offsetX);
  this.height = this.rows * (this.itemSize + this.offsetY);
  this.colors = ["#000", "#22F", "#0C0", "#0CC", "#E00", "#C0C", "#FC0", "#FFF"];
  this.itemsArray = [];
  this.itemsArrayBlocks = [];
  this.drawBg = true;
  this.closestIndex = 0;
  this.fallingGroup = [];
  this.fallingGroupDirection = 0;
  this.doMove = false;
  this.closestItem = 0;
  this.nextColors = [0,0];
  this.nextBlocks = [];
  this.timerStopMovable = 0;
  this.stopMovableTarget = settings.fps*2/3;
  this.nextAction = 0;
  this.spawnNextTimer = settings.fps/2;
  this.currentLevel = -1;
  //this.levels;
};

Jar.prototype.init = function() {
  this.isAlive = true;
  //this.nextColors = this.pickColors();
  //this.updateNextBlocks();
  for (var y = 0; y < this.rows; y++) {
    for (var x = 0; x < this.cols; x++) {
      this.itemsArray[x + y*this.cols] = 0;
//        this.itemsArrayBlocks[x + y*this.cols] = undefined;
    };
  };
  this.nextAction = 0;
  this.score = 0;
  this.initFallingGroupOrientation(); // 0, 0.5, 1, -0.5
  this.spawnNextTimer = settings.fps/2;
  this.penaltyItemsToAdd = 0;
  this.innerItemsTosendToEnemy = 0;
  this.itemsToSendToEnemy = 0;
};
Jar.prototype.initRound = function() {
  this.nextColors = this.pickColors(this.levels[this.currentLevel].movableBlocks);
  this.updateNextBlocks();
}
Jar.prototype.updateNextBlocks = function()
{
  var colorValue = this.nextColors[0];
  this.nextBlocks.push(new Block({
    x:this.width+this.itemSize, y: this.itemSize, width: this.itemSize, height: this.itemSize, 
    color: this.colors[colorValue], colorValue: colorValue, isMovable: false
  }));
  colorValue = this.nextColors[1];
  this.nextBlocks.push(new Block({
    x:this.width+this.itemSize*2, y: this.itemSize, width: this.itemSize, height: this.itemSize, 
    color: this.colors[colorValue], colorValue: colorValue, isMovable: false
  }));
}
Jar.prototype.initFallingGroupOrientation = function ()
{
  this.fallingGroupOrientationX = this.itemSize;
  this.fallingGroupOrientationY = 0;
}
Jar.prototype.decrementOrientation = function()
{
  if(this.fallingGroupOrientationX == this.itemSize)
  {
    this.fallingGroupOrientationX = 0;
    this.fallingGroupOrientationY = this.itemSize;
  }
  else if(this.fallingGroupOrientationX == 0 && this.fallingGroupOrientationY == this.itemSize)
  {
    this.fallingGroupOrientationX = -this.itemSize;
    this.fallingGroupOrientationY = 0;
  }
  else if(this.fallingGroupOrientationX == -this.itemSize)
  {
    this.fallingGroupOrientationX = 0;
    this.fallingGroupOrientationY = -this.itemSize;
  }
  else
  {
    this.fallingGroupOrientationX = this.itemSize;
    this.fallingGroupOrientationY = 0;
  }
}
Jar.prototype.incrementOrientation = function()
{
  if(this.fallingGroupOrientationX == this.itemSize)
  {
    this.fallingGroupOrientationX = 0;
    this.fallingGroupOrientationY = -this.itemSize;
  }
  else if(this.fallingGroupOrientationX == 0 && this.fallingGroupOrientationY == -this.itemSize)
  {
    this.fallingGroupOrientationX = -this.itemSize;
    this.fallingGroupOrientationY = 0;
  }
  else if(this.fallingGroupOrientationX == -this.itemSize)
  {
    this.fallingGroupOrientationX = 0;
    this.fallingGroupOrientationY = this.itemSize;
  }
  else
  {
    this.fallingGroupOrientationX = this.itemSize;
    this.fallingGroupOrientationY = 0;
  }
}
Jar.prototype.takeInput = function(keys) {
  if(this.fallingGroup.length==0)
    return;

  var previousOrientationX = this.fallingGroupOrientationX;
  var previousOrientationY = this.fallingGroupOrientationY;
  if(keys.A() || keys.B())
  {
    if(this.nextAction > 0)
      this.nextAction--;
    else
    {
      this.nextAction = settings.fps/2;
      if(keys.B())
        this.incrementOrientation();
      else 
        this.decrementOrientation();
      var nextPos = {
        x : this.fallingGroup[0].x + this.fallingGroupOrientationX,
        y : this.fallingGroup[0].y + this.fallingGroupOrientationY
      }
      var masterIndex = this.getClosestIndexInArray(this.fallingGroup[0]);
      masterIndex-=this.cols;
      var slaveIndex = this.getClosestIndexInArray(nextPos);
      slaveIndex-=this.cols;
      if(nextPos.x >= 0 && nextPos.x < this.width
        && masterIndex != slaveIndex && this.itemsArray[slaveIndex]===0)
      {
        this.fallingGroup[1].x = nextPos.x;
        this.fallingGroup[1].y = nextPos.y;
      }
      else if(this.fallingGroupOrientationX < 0 && masterIndex % this.cols < this.cols-1 
        && this.itemsArray[masterIndex+1] === 0)
      {
        this.fallingGroup[0].x += this.itemSize;
        this.fallingGroup[1].x = this.fallingGroup[0].x + this.fallingGroupOrientationX;
        this.fallingGroup[1].y = this.fallingGroup[0].y;
      }
      else if(this.fallingGroupOrientationX > 0 && masterIndex % this.cols > 0 
        && this.itemsArray[masterIndex-1] === 0)
      {
        this.fallingGroup[0].x -= this.itemSize;
        this.fallingGroup[1].x = this.fallingGroup[0].x + this.fallingGroupOrientationX;
        this.fallingGroup[1].y = this.fallingGroup[0].y;
      }
      else if(this.fallingGroupOrientationY > 0 
        && this.itemsArray[slaveIndex] > 0)
      {
        this.fallingGroup[0].y -= this.itemSize;
        this.fallingGroup[1].x = this.fallingGroup[0].x;
        this.fallingGroup[1].y = this.fallingGroup[0].y + this.fallingGroupOrientationY;
      }
      else
      {
        this.fallingGroupOrientationX = previousOrientationX;
        this.fallingGroupOrientationY = previousOrientationY;
      }
    }
  }
  else
  {
    this.nextAction = 0;
  }

  var masterIndexCol = this.getColFromIndex(this.getClosestIndexInArray(this.fallingGroup[0]));
  var slaveIndexCol = this.getColFromIndex(this.getClosestIndexInArray(this.fallingGroup[1]));
  if(keys.left() && masterIndexCol > 0 && slaveIndexCol > 0)
  {
    this.doMove = (this.fallingGroupDirection != -1);
    this.fallingGroupDirection = -1;
  }
  else if(keys.right() && masterIndexCol < this.cols-1 && slaveIndexCol < this.cols - 1)
  {
    this.doMove = (this.fallingGroupDirection != 1);
    this.fallingGroupDirection = 1;
  }
  else
  {
    this.doMove = false;
    this.fallingGroupDirection = 0;
  }
  if(keys.down())
  {
    for (var i = 0; i < this.fallingGroup.length; i++) {
      this.fallingGroup[i].speedyFall();
    };
  }
  else
  {
    for (var i = 0; i < this.fallingGroup.length; i++) {
      this.fallingGroup[i].fall();
    };
  }

  if(this.doMove === true)
  {
    var oldXPositions = [];
    for (var i = 0; i < this.fallingGroup.length; i++) {
      oldXPositions.push(this.fallingGroup[i].x);
    };

    var revertPositions = false;
    for (var i = 0; i < this.fallingGroup.length; i++) {
      this.fallingGroup[i].x = Math.min(this.width - this.itemSize, 
                              Math.max(0, 
                                this.fallingGroup[i].x + (this.fallingGroupDirection * this.itemSize)));
    }
    for (var i = 0; i < this.fallingGroup.length; i++) {
      var arrayIndex = this.getClosestIndexInArray(this.fallingGroup[i]);
      if(this.hasToStopFallingGroupFromIndex(arrayIndex))
      {
        revertPositions = true;
        break;
      }
    }

    if(revertPositions)
    {
      for (var i = 0; i < this.fallingGroup.length; i++) {
        this.fallingGroup[i].x = oldXPositions[i];
      };
    }
    else
    {
      //this.timerStopMovable = 0;
    }
  }
};

Jar.prototype.update = function () {
  if(!this.isAlive)
    return;

  this.innerCounter++;
  this.blinkCounter++;
  this.blinkCounter = this.blinkCounter % (settings.fps/2);
  if(this.fallingGroup.length == 0 && this.gameObjects.length == 0)
  {
    this.spawnNextTimer++;
    if(this.spawnNextTimer >= settings.fps/2)
    {
      if(this.itemsArray[3+ (this.rows-1)*this.cols] > 0 || this.itemsArray[4+ (this.rows-1)*this.cols] > 0)
      {
        this.isAlive = false;
        return;
      }
      if(this.penaltyItemsToAdd > 0)
      {
        this.addPenaltyElement();
        this.spawnNextTimer = Math.max(0, this.spawnNextTimer - 5);
      }
      else this.spawnNewMovableObjects();
    }
  }
  for (var i = this.fallingGroup.length - 1; i >= 0; i--) {
    this.fallingGroup[i].update();
  };
  for (var i = this.gameObjects.length - 1; i >= 0; i--) {
    this.gameObjects[i].update();
  };
  for (var i = this.itemsArrayBlocks.length - 1; i >= 0; i--) {
    if(this.itemsArrayBlocks[i])
      this.itemsArrayBlocks[i].update();
  };
  for (var i = this.nextBlocks.length - 1; i >= 0; i--) {
    this.nextBlocks[i].update();
  };

  this.checkDisappearance();
};
Jar.prototype.pickColors = function(allowedValues)
{
  return [this.pickColor(allowedValues), this.pickColor(allowedValues)];
}
Jar.prototype.pickColor = function(allowedValues)
{
//    var allowedValues = [1,2,4,1,2,4,1,2,4,1,2,4,3,5,6,3,5,6,7];
  var resultIndex = Math.floor(Math.random() * (allowedValues.length));
  return allowedValues[resultIndex];
}
Jar.prototype.spawnNewMovableObjects = function ()
{
  //Signal the top level we got presents to send to the opponent.
  this.itemsToSendToEnemy = this.innerItemsTosendToEnemy;
  this.innerItemsTosendToEnemy = 0;

  this.timerStopMovable = 0;
  this.spawnNextTimer = 0;
  this.initFallingGroupOrientation();
  var col = 3;
  var block = this.spawnNewElement(this.nextColors[0], col+ (this.rows-1)*this.cols);
  block.isMovable = true;
  col++;
  blockSlave = this.spawnNewElement(this.nextColors[1], col+ (this.rows-1)*this.cols);
  blockSlave.isMovable = true;
  this.fallingGroup = [block, blockSlave];
  this.nextColors = this.pickColors(this.levels[this.currentLevel].movableBlocks);
  this.updateNextBlocks();
}
Jar.prototype.addPenaltyElement = function()
{
  var _self = this;
  var penaltyArray = [];
  for(var i=0; i<this.cols;i++)
  {
    penaltyArray[i] = 0;
  }
  function pickIndex() {
    var pickedCol = Math.floor(Math.random() * (_self.cols));
    return (_self.rows -1) * _self.cols + pickedCol;
  }
  var addedItems = 0;
  while(this.penaltyItemsToAdd > 0 && addedItems < this.cols)
  {
    var colorValue = this.pickColor(this.levels[this.currentLevel].penaltyBlocks);
    var pickedIndex = pickIndex();
    while(penaltyArray[pickedIndex % this.cols] > 0)
    {
      pickedIndex = pickIndex();
    }
    penaltyArray[pickedIndex % this.cols] = colorValue;
    var block = this.spawnNewElement(colorValue, pickedIndex);
    block.speedyFall();
    this.gameObjects.push(block);
    this.penaltyItemsToAdd--;
    addedItems++;
  }
}
Jar.prototype.spawnNewElement = function (colorValue, index)
{
  var x = this.getXFromIndexInArray(index);
  var y = this.getYFromIndexInArray(index);
  var block = new Block({x:x, y: y, width: this.itemSize, height: this.itemSize, speed: this.levels[this.currentLevel].speed, color: this.colors[colorValue], colorValue: colorValue, isMovable: false});
  block.fall();
  return block;
}

Jar.prototype.stopFallingGroup = function ()
{
  for (var i = 0; i < this.fallingGroup.length; i++) {
    this.fallingGroup[i].isMovable = false;
    var itemsArrayIndex = this.getClosestIndexInArray(this.fallingGroup[i]);
    itemsArrayIndex -= this.cols; // fucking bug gives y + 1...
    this.setArrayItem(itemsArrayIndex, this.fallingGroup[i].colorValue);
  };
  this.fallingGroup = [];
}
Jar.prototype.hasToStopFallingGroupFromIndex = function (index)
{
  return this.getRowFromIndex(index) == 0
    || this.itemsArray[index-this.cols] > 0;
}
Jar.prototype.canCombine = function (first, second)
{
  return (first ^ second) == (first | second);
}
Jar.prototype.combine = function (first, second)
{
  return first | second;
}
Jar.prototype.hasToStopBlockFromIndex = function (index, colorValue)
{
  return this.getRowFromIndex(index) == 0
    || !this.canCombine(this.itemsArray[index-this.cols], colorValue);
}
Jar.prototype.checkCollision = function()
{
  if(!this.isAlive)
    return;

  for (var i = 0; i < this.fallingGroup.length; i++) {
    var arrayIndex = this.getClosestIndexInArray(this.fallingGroup[i]);
    if(this.hasToStopFallingGroupFromIndex(arrayIndex))
    {
      var arrayIndex0 = this.getClosestIndexInArray(this.fallingGroup[0]);
      var y0 = this.getYFromIndexInArray(arrayIndex0)-1;
      var y1 = y0 + this.fallingGroupOrientationY;
      //console.log(this.fallingGroup[0].y + " " + this.fallingGroup[1].y);
      //console.log(y0 +" " + y1);
      this.fallingGroup[0].y = y0;//this.fallingGroup[0].velocityY;
      this.fallingGroup[1].y = y1;//-= this.fallingGroup[1].velocityY;
      this.timerStopMovable++;
      if(this.fallingGroup[i].isSpeedyFalling() || this.timerStopMovable > this.stopMovableTarget)
        this.stopFallingGroup();

      break;
    }
  };
  for (var i = 0; i < this.itemsArray.length; i++) {
    if(this.itemsArray[i]>0 && !this.hasToStopBlockFromIndex(i, this.itemsArray[i]))
    {
      var block = this.spawnNewElement(this.itemsArray[i], i);
      this.gameObjects.push(block);
      this.setArrayItem(i, 0);
    }
  };
  for (var i = 0; i < this.gameObjects.length; i++) {
    var arrayIndex = this.getClosestIndexInArray(this.gameObjects[i]);
    this.closestItem = arrayIndex;
    if(this.hasToStopBlockFromIndex(arrayIndex, this.gameObjects[i].colorValue))
    {
      this.gameObjects[i].stopFalling();
      this.setArrayItem(arrayIndex, this.combine(this.itemsArray[arrayIndex], this.gameObjects[i].colorValue));
      this.gameObjects[i].x = this.getXFromIndexInArray(this.closestItem);
      this.gameObjects[i].y = this.getYFromIndexInArray(this.closestItem);
    }
  };
  var i=0;
  while(i<this.gameObjects.length)
  {
    if(this.gameObjects[i].velocityY == 0)
    {
      this.gameObjects.splice(i, 1);
    }
    else i++;
  }
}
Jar.prototype.setArrayItem = function ( index, colorValue )
{
  this.itemsArray[index] = colorValue;
  if(colorValue == 0)
  {
    this.itemsArrayBlocks[index] = undefined;
  }
  else
  {
    var x = this.getXFromIndexInArray(index);
    var y = this.getYFromIndexInArray(index);
    this.itemsArrayBlocks[index] = new Block({x:x, y: y, width: this.itemSize, height: this.itemSize, color: this.colors[colorValue], colorValue: colorValue, isMovable: false});
  }
}
Jar.prototype.checkDisappearance = function()
{
  if( this.gameObjects.length > 0 )
    return;

  var extra = 0;
  for (var i = 0; i < this.itemsArray.length; i++) {
    if(this.itemsArray[i] == 7)
    {
      var groupIndex = [];
      this.getIndexGroupOfSimilarItems(i, this.itemsArray[i], groupIndex);
      if(groupIndex.length>3)
      {
        var scoreToAdd = 40;
        extra = (groupIndex.length-4);
        //ajout de la penalite supp
        this.innerItemsTosendToEnemy += Math.ceil(groupIndex.length/2);

        scoreToAdd+= (extra*extra)*10;
        this.score += scoreToAdd;
        for (var i = 0; i < groupIndex.length; i++) {
          this.setArrayItem(groupIndex[i], 0);
        };
      }
    }
  };
}
Jar.prototype.getIndexGroupOfSimilarItems = function(index, colorValue, result)
{
  if(this.itemsArray[index] == colorValue && result.indexOf(index) == -1)
  {
    result.push(index);
    var col = this.getColFromIndex(index);
    var row = this.getRowFromIndex(index);
    if(col < this.cols-1)
      this.getIndexGroupOfSimilarItems(index+1, colorValue, result);
    if(row < this.rows-1)
      this.getIndexGroupOfSimilarItems(index+this.cols, colorValue, result);
    if(col > 0)
      this.getIndexGroupOfSimilarItems(index-1, colorValue, result);
    if(row > 0)
      this.getIndexGroupOfSimilarItems(index-this.cols, colorValue, result);
  }

}
Jar.prototype.getPositionsFromArrayIndex = function(index)
{
  var x = (index % this.cols) * this.itemSize;
  var y = this.height - this.itemSize - Math.floor(index / this.cols) * this.itemSize;
  return {x:x, y:y};
}
Jar.prototype.getClosestIndexInArray = function(object) {
  return this.getColFromX(object.x) + this.getRowFromY(object.y) * this.cols;
}
Jar.prototype.getClosestElementInArray = function(object) {
  return this.itemsArray[this.getClosestIndexInArray(object)];
}
Jar.prototype.setClosestElementInArray = function(object) {
  this.setArrayItem(
    this.getColFromX(object.x) + this.getRowFromY(object.y) * this.cols,
    object.item
  );
};
Jar.prototype.getRowFromIndex = function(index) {
  return Math.floor(index/this.cols);
};
Jar.prototype.getColFromIndex = function(index) {
  return index % this.cols;
}
Jar.prototype.getColFromX = function(xPos)
{
  return Math.round(xPos/this.itemSize + 0.49);
}
Jar.prototype.getRowFromY = function(yPos)
{
  return this.rows - Math.round(yPos/this.itemSize +0.5);
}
Jar.prototype.getXFromIndexInArray = function (index) {
  return (index % this.cols)*this.itemSize;
}
Jar.prototype.getYFromIndexInArray = function (index) {
  return this.height - (Math.floor(index / this.cols) + 1) * this.itemSize; // y est en haut du bloc
}
Jar.prototype.draw = function() {
  wideCanvas.ctx.fillStyle = "#888";
  var drawingHeight = this.height - this.itemSize; // retrait de la ligne du haut
  wideCanvas.ctx.fillRect(this.x, this.y, this.width, drawingHeight); 
  wideCanvas.ctx.save();
  wideCanvas.ctx.translate(this.x, this.y-this.itemSize);

  if(this.drawBg)
  {
    for (var i = 0; i < this.itemsArray.length; i++) {
      if(this.itemsArray[i] > 0)
      {
        this.itemsArrayBlocks[i].draw();
//          this.drawItem(this.itemsArray[i], this.getXFromIndexInArray(i), this.getYFromIndexInArray(i));
      }
    };
  }
  for(var i =0; i<this.gameObjects.length; i++)
  {
    this.gameObjects[i].draw();
  }
  for(var i =0; i<this.fallingGroup.length; i++)
  {
    if(i==0 && this.blinkCounter > settings.fps/4)
    {
      this.fallingGroup[i].blink();
    }
    this.fallingGroup[i].draw();
  }

  wideCanvas.ctx.translate(0, this.itemSize);
  wideCanvas.ctx.font="16px Arial";
  wideCanvas.ctx.textAlign = "center";
  wideCanvas.ctx.fillStyle = "#222";
  wideCanvas.ctx.fillText("NEXT", this.width + this.itemSize*2, this.itemSize - 3);
  for (var i =0; i<this.nextBlocks.length; i++) {
    this.nextBlocks[i].draw();
  };
//    this.drawItem(this.nextColors[0], this.width+this.itemSize, this.itemSize);
//    this.drawItem(this.nextColors[1], this.width+this.itemSize*2, this.itemSize);
  wideCanvas.ctx.fillStyle = "#222";
  if(this.penaltyItemsToAdd > 0)
    wideCanvas.ctx.fillText("Penalty : "+this.penaltyItemsToAdd, this.width + this.itemSize*2, this.height - this.itemSize*3);
  wideCanvas.ctx.fillText("SCORE", this.width + this.itemSize*2, this.height - this.itemSize*2);
  wideCanvas.ctx.textAlign = "right";
  wideCanvas.ctx.fillText(this.score, this.width + this.itemSize*3, this.height - this.itemSize);
  if(!this.isAlive)
  {
    wideCanvas.ctx.fillStyle = "rgba(0,0,0, 0.5)";
    wideCanvas.ctx.fillRect(0,0, this.width, drawingHeight);
  }
  wideCanvas.ctx.fillStyle = settings.backgroundColor;
  wideCanvas.ctx.fillRect(0, -this.itemSize, this.width, this.itemSize);
  wideCanvas.ctx.restore();
};
Jar.prototype.drawGetReady = function () {
  if(this.isAlive)
  {
    wideCanvas.ctx.save();
    wideCanvas.ctx.translate(this.x, this.y);
    wideCanvas.ctx.fillStyle = "#222";
    wideCanvas.ctx.font = "30px Arial";
    wideCanvas.ctx.textAlign = "center";
    wideCanvas.ctx.fillText("GET READY !", this.width/2, this.height/2);
    wideCanvas.ctx.restore();
  }
}
module.exports = Jar;