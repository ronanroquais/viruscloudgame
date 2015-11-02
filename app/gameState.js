
'use strict';
// gameState
var wideCanvas = require('./lib/wideCanvas');
var settings = require('./settings');
var Jar = require('./jar');
var levels = require('./levels');
var PhysicsBody = require('./physics/physicsBody');
var PhysicsManager = require('./physics/physicsManager');

var Entity = require('./entity/entity');
var RenderManager = require('./render/rendermanager');

var GameState = function(gameCallbacks)
{

  var renderManager;
  var physicsManager;

  var entityList  = [];

  // times in milliseconds
  var maxTime;
  var startTime;
  var winner = settings.OWNER_PLAYER_A;

  this.init = function() {
    this.renderManager = new RenderManager();
    this.renderManager.init(wideCanvas);
    this.physicsManager = new PhysicsManager(this);
    this.physicsManager.init();

    entityList = [];
    entityList = this.getLevel();

    this.startTime  = Date.now();
    this.maxTime    = 30000;
  };
  
  this.initRound = function() {
  };

  this.getLevel = function () {
    var result = [];
    var levelindex = Math.floor(Math.random() * 3);
    console.log("level "+levelindex);
    var items = levels.getLevel(0);
    for (var i = 0; i < items.length; i++) {
      result.push(this._createEntity(items[i], items[i].owner));
    };
    return result;
  };


  this.isGameFinished = function() 
  {
//      if(this._timeLeft <= 0)
//        return true;
    //return false;
    var hasP1 = false,
    hasP2 = false,
    hasP3 = false,
    hasP4 = false;
    var activePlayers = 0;

    for (var i = 0; i < entityList.length; i++)
    {
      if(!hasP1 && entityList[i].owner == settings.OWNER_PLAYER_A)
      {
        hasP1 = true;
        winner = settings.OWNER_PLAYER_A;
        activePlayers++;
      }
      if(!hasP2 && entityList[i].owner == settings.OWNER_PLAYER_B)
      {
        hasP2 = true;
        winner = settings.OWNER_PLAYER_B;
        activePlayers++
      }
      if(!hasP3 && entityList[i].owner == settings.OWNER_PLAYER_C)
      {
        hasP3 = true;
        winner = settings.OWNER_PLAYER_C;
        activePlayers++;
      }
      if(!hasP4 && entityList[i].owner == settings.OWNER_PLAYER_D)
      {
        hasP4 = true;
        winner = settings.OWNER_PLAYER_D;
        activePlayers++;
      }
    };
    return activePlayers <=1;
  };
  this.takeInput = function(keys)
  {
    var p1Keys = keys[0];
    var p2Keys = keys[1];
    if(this.isGameFinished())
    {
      if(p1Keys.start() || p2Keys.start())
      {
        gameCallbacks.startGameState();
      }
      for(var index in entityList)
      {
        entityList[index].physicsBody.noMove();
      }
      return;
    }
    var key;
    for(var index in entityList)
    {
      if(entityList[index].owner == settings.OWNER_PLAYER_A)
      {
        key = p1Keys;
      }
      else if(entityList[index].owner == settings.OWNER_PLAYER_B)
      {
        key = p2Keys;
      }
      else if(entityList[index].owner == settings.OWNER_PLAYER_C)
      {
        key = keys[2];
      }
      else if(entityList[index].owner == settings.OWNER_PLAYER_D)
      {
        key = keys[3];
      }
      else key = null;
      if(key)
      {
        if(key.left())
          entityList[index].physicsBody.moveLeft();
        else if(key.right())
          entityList[index].physicsBody.moveRight();
        else entityList[index].physicsBody.noMove();
        if(key.up() || key.A())
          entityList[index].physicsBody.jump();
        else entityList[index].physicsBody.noJump();
      }
    }
  };
  this.update = function() {
    this.physicsManager.update(entityList);
    this.checkCollision();
  };
  this.checkCollision = function () {
    this.physicsManager.checkCollision(entityList)
  };
  this.draw = function() {
    this.renderManager.render(entityList, Math.ceil(this._timeLeft() / 1000));
    if(this.isGameFinished())
    {
      wideCanvas.ctx.fillStyle = "#e00";
      var text;
      switch(winner)
      {
        case settings.OWNER_PLAYER_B:
          text = "PLAYER 2 WINS";
          break;
        case settings.OWNER_PLAYER_C:
          text = "PLAYER 3 WINS";
          break;
        case settings.OWNER_PLAYER_D:
          text = "PLAYER 4 WINS";
          break;
        case settings.OWNER_PLAYER_A:
        default:
          text = "PLAYER 1 WINS";
          break;
      }
      wideCanvas.ctx.font  = "bold 30px Verdana";
      wideCanvas.ctx.textAlign = "center";
      wideCanvas.ctx.fillText(text, settings.hCenter, settings.vCenter);
      wideCanvas.ctx.strokeStyle = "#eee";
      wideCanvas.ctx.strokeText(text, settings.hCenter, settings.vCenter);
    }

  };
  // takes the entity to be converted and its new owner value
  this.convertEntity  = function(entity, newOwner)
  {
    this._setEntityImage(entity, this._getImgFromOwner(newOwner));
    entity.owner  = newOwner;
  };
  this.entityJumpsOn = function(base, target)
  {
    console.log("entity jumps on "+base + " " + target);
    if(entityList[base].owner != entityList[target].owner && entityList[base].owner != settings.OWNER_NPC)
    {
      entityList[base].physicsBody.jump();
      this.convertEntity(entityList[target], entityList[base].owner);
    }
  }

  this._createEntity  = function(physicsOpts, owner) {
    var entity    = new Entity();
    owner = owner || settings.OWNER_PLATFORM;

    entity.init();

    this._setEntityImage(entity, this._getImgFromOwner(owner));
    console.log("physicsBody");
    console.log(physicsOpts);

    entity.physicsBody  = new PhysicsBody(physicsOpts);
    entity.owner        = owner;

    return entity;
  };

  this._setEntityImage  = function(entity, imagePath)
  {
    var image       = new Image();
    image.onload    = function() {
      entity.image  = image;
    };
    image.src       = imagePath;
  };

  this._getImgFromOwner = function(owner)
  {
    var imagePath;

    switch (owner)
    {
      case settings.OWNER_PLAYER_A:
        imagePath = "img/appdemon.png";
        break;
      
      case settings.OWNER_PLAYER_B:
        imagePath = "img/appskull.png";
        break;
      
      case settings.OWNER_PLAYER_C:
        imagePath = "img/bis.png";
        break;
      
      case settings.OWNER_PLAYER_D:
        imagePath = "img/bis.png";
        break;

      case settings.OWNER_NPC:
        imagePath = "img/appnpc.png";
        break;

      case settings.OWNER_PLATFORM:
        imagePath = "img/platformTile.png";
        break;
    }

    return imagePath;
  }

  this._timeElapsed = function()
  {
    return Date.now() - this.startTime;
  }

  this._timeLeft    = function()
  {
    var left  = this.maxTime - this._timeElapsed();
    return left > 0 ? left : 0;
  };

  this.init(); // constructor call
};
module.exports = GameState;
