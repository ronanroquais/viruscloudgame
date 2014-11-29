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

    this.init = function() {
      this.renderManager = new RenderManager();
      this.renderManager.init(wideCanvas);
      this.physicsManager = new PhysicsManager(this);
      this.physicsManager.init();

      // create first player
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:100, y:200, width:32, height:32 },
          OWNER_PLAYER_A
        )
      );

      // NPC
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:600, y:200, width:32, height:32 }
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:600, y:200, width:32, height:32 }
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:600, y:200, width:32, height:32 }
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:600, y:200, width:32, height:32 }
        )
      );

      // NPC
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:600, y:200, width:32, height:32 }
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:600, y:200, width:32, height:32 }
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:600, y:200, width:32, height:32 }
        )
      );
      // NPC
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:600, y:200, width:32, height:32 }
        )
      );

      // create test platform
      entityList.push(
        this._createEntity(
          "app/img/platformTile.png",
          { x:300, y:100, width:100, height:20, isFixed:true }
        )
      );
      // create test platform
      entityList.push(
        this._createEntity(
          "app/img/platformTile.png",
          { x:500, y:50, width:100, height:20, isFixed:true }
        )
      );
      // create test platform
      entityList.push(
        this._createEntity(
          "app/img/platformTile.png",
          { x:150, y:200, width:100, height:20, isFixed:true },
          OWNER_PLATFORM
        )
      );
      // create test platform
      entityList.push(
        this._createEntity(
          "app/img/platformTile.png",
          { x:400, y:150, width:100, height:20, isFixed:true },
          OWNER_PLATFORM
        )
      );

      this.startTime  = Date.now();
      this.maxTime    = 30000;
    };
    
    this.initRound = function() {
    };
    
    this.isGameFinished = function() 
    {
    };
    
    this.takeInput = function(p1Keys, p2Keys)
    {
      if(p1Keys.left())
        entityList[0].physicsBody.moveLeft();
      else if(p1Keys.right())
        entityList[0].physicsBody.moveRight();
      if(p1Keys.A())
        entityList[0].physicsBody.jump();
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
    };
    // takes the entity to be converted and its new owner value
    this.convertEntity  = function(entity, newOwner)
    {
      this._setEntityImage(entity, this._getImgFromOwner(newOwner));
      entity.owner  = newOwner;
    };
    this.entityJumpsOn = function(base, target)
    {
      console.log(base + " jumps on " + target);
    }

    this._createEntity  = function(imagePath, physicsOpts, owner) {
      var entity    = new Entity();

      entity.init();

      this._setEntityImage(entity, imagePath);

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
          imagePath = "app/img/playerA.png";
          break;
        
        case OWNER_PLAYER_B:
          imagePath = "app/img/playerB.png";
          break;

/*        case OWNER_NPC:
          imagePath = "app/img/playerA.png";
          break;*/

        case OWNER_PLATFORM:
          imagePath = "app/img/platformTile.png";
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