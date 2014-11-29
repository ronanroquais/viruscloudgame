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
    var renderManager;
    var physicsManager;

    var entityList  = [];

    this.init = function() {
      this.renderManager = new RenderManager();
      this.renderManager.init(wideCanvas);
      this.physicsManager = new PhysicsManager(this);
      this.physicsManager.init();

      // create first player
      entityList.push(
        this._createEntity(
          "app/img/playerA.png",
          { x:100, y:200, width:32, height:32 }
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
          { x:150, y:200, width:100, height:20, isFixed:true }
        )
      );
      // create test platform
      entityList.push(
        this._createEntity(
          "app/img/platformTile.png",
          { x:400, y:150, width:100, height:20, isFixed:true }
        )
      );
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
      this.renderManager.render(entityList);
    };
    this.entityJumpsOn = function(base, target)
    {
      console.log(base + " jumps on " + target);
    }

    this._createEntity  = function(imagePath, physicsOpts) {
      var entity    = new Entity();

      entity.init();

      var image       = new Image();
      image.onload    = function() {
        entity.image  = image;
      };
      image.src       = imagePath;

      entity.physicsBody  = new PhysicsBody(physicsOpts);

      return entity;
    };
    this.init(); // constructor call
  };
  return GameState;
});