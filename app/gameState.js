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
      this.physicsManager = new PhysicsManager();
      this.physicsManager.init();

      entityList.push(new Entity());

      entityList.forEach(function(e) {
        e.init();

        var image     = new Image();
        image.onload  = function() {
          e.image = image;
        };
        image.src     = "app/img/playerA.png";

        e.physicsBody = new PhysicsBody({
          x:100,
          y:200,
          width:10,
          height:10
        });
      });
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
    this.init(); // constructor call
  };
  return GameState;
});