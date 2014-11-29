define(function(require) {
  'use strict';
  // gameState
  var wideCanvas = require('lib/wideCanvas');
  var settings = require('settings');
  var Jar = require('jar');
  var levels = require('levels');
  var PhysicsBody = require('physics/physicsBody');
  var PhysicsManager = require('physics/physicsManager');

  var Entity = require('entity/entity');
  var RenderManager = require('render/rendermanager');

  var GameState = function(gameCallbacks)
  {
    var OWNER_PLAYER_A  = "owner_player_a";
    var OWNER_PLAYER_B  = "owner_player_b";
    var OWNER_NPC       = "owner_npc";
    var OWNER_PLATFORM  = "owner_platform";

    var renderManager;
    var physicsManager;

    var entityList  = [];

    // times in milliseconds
    var maxTime;
    var startTime;
    var p1wins = false;

    this.init = function() {
      this.renderManager = new RenderManager();
      this.renderManager.init(wideCanvas);
      this.physicsManager = new PhysicsManager(this);
      this.physicsManager.init();

      // create first player
      entityList.push(
        this._createEntity(
          { x:100, y:200, width:32, height:32 },
          OWNER_PLAYER_A
        )
      );

      // NPC
      entityList.push(
        this._createEntity(
          { x:700, y:200, width:32, height:32 },
          OWNER_PLAYER_B
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          { x:400, y:100, width:32, height:32 },
          OWNER_NPC
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          { x:400, y:400, width:32, height:32 },
          OWNER_NPC
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          { x:500, y:300, width:32, height:32 },
          OWNER_NPC
        )
      );

      // NPC
      entityList.push(
        this._createEntity(
          { x:300, y:300, width:32, height:32 },
          OWNER_NPC
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          { x:200, y:200, width:32, height:32 },
          OWNER_NPC
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          { x:600, y:100, width:32, height:32 },
          OWNER_NPC
        )
      );

      // create test platform
      entityList.push(
        this._createEntity(
          { x:400, y:300, width:100, height:20, isFixed:true }
        )
      );
      entityList.push(
        this._createEntity(
          { x:290, y:220, width:100, height:20, isFixed:true }
        )
      );
      entityList.push(
        this._createEntity(
          { x:510, y:220, width:100, height:20, isFixed:true }
        )
      );
      // create test platform
      entityList.push(
        this._createEntity(
          { x:100, y:150, width:100, height:20, isFixed:true }
        )
      );
      // create test platform
      entityList.push(
        this._createEntity(
          { x:700, y:150, width:100, height:20, isFixed:true }
        )
      );
      // create test platform
      entityList.push(
        this._createEntity(
          { x:250, y:50, width:100, height:20, isFixed:true },
          OWNER_PLATFORM
        )
      );
      // create test platform
      entityList.push(
        this._createEntity(
          { x:550, y:50, width:100, height:20, isFixed:true },
          OWNER_PLATFORM
        )
      );
      // create test platform
/*      entityList.push(
        this._createEntity(
          { x:650, y:150, width:100, height:20, isFixed:true },
          OWNER_PLATFORM
        )
      );
*/
      this.startTime  = Date.now();
      this.maxTime    = 30000;
    };
    
    this.initRound = function() {
    };
    
    this.isGameFinished = function() 
    {
//      if(this._timeLeft <= 0)
//        return true;

      for (var i = 0; i < entityList.length; i++)
      {
        if(entityList[i].owner == OWNER_PLAYER_B)
          break
        else if(i == entityList.length -1)
        {
          p1wins = true;
          return true;
        }
      };
      for (var i = 0; i < entityList.length; i++)
      {
        if(entityList[i].owner == OWNER_PLAYER_A)
          break
        else if(i == entityList.length -1)
        {
          p1wins = false;
          return true;
        }
      };
    };
    
    this.takeInput = function(p1Keys, p2Keys)
    {
      if(this.isGameFinished())
      {
        if(p1Keys.start() || p2Keys.start())
        {
          gameCallbacks.startGameState();
        }
        return;
      }
      for(var index in entityList)
      {
        if(entityList[index].owner == OWNER_PLAYER_A)
        {
          if(p1Keys.left())
            entityList[index].physicsBody.moveLeft();
          else if(p1Keys.right())
            entityList[index].physicsBody.moveRight();
          if(p1Keys.up() || p1Keys.A())
            entityList[index].physicsBody.jump();
        }
        else if(entityList[index].owner == OWNER_PLAYER_B)
        {
          if(p2Keys.left())
            entityList[index].physicsBody.moveLeft();
          else if(p2Keys.right())
            entityList[index].physicsBody.moveRight();
          if(p2Keys.up() || p2Keys.A())
            entityList[index].physicsBody.jump();
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
        var text = "RED VIRUS WINS";
        if(!p1wins)
        {
          text = "BLACK VIRUS WINS";
        }
        wideCanvas.ctx.font  = "30px Verdana";
        wideCanvas.ctx.fillText(text, 280, 250);
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
      if(entityList[base].owner != entityList[target].owner && entityList[base].owner != OWNER_NPC)
      {
        entityList[base].physicsBody.jump();
        this.convertEntity(entityList[target], entityList[base].owner);
      }
    }

    this._createEntity  = function(physicsOpts, owner) {
      var entity    = new Entity();
      owner = owner || OWNER_PLATFORM;

      entity.init();

      this._setEntityImage(entity, this._getImgFromOwner(owner));

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
        case OWNER_PLAYER_A:
          imagePath = "img/appdemon.png";
          break;
        
        case OWNER_PLAYER_B:
          imagePath = "img/appskull.png";
          break;

        case OWNER_NPC:
          imagePath = "img/appnpc.png";
          break;

        case OWNER_PLATFORM:
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
  return GameState;
});