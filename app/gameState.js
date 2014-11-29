define(function(require) {
  'use strict';
  // gameState
  var wideCanvas = require('lib/wideCanvas');
  var settings = require('settings');
  var Jar = require('jar');
  var levels = require('levels');
  var PhysicsBody = require('physics/physicsBody');

  var Entity = require('entity/entity');
  var RenderManager = require('render/rendermanager');

  var GameState = function(gameCallbacks)
  {
    var renderManager;

    var entityList  = [];

    this.init = function() {
      this.renderManager = new RenderManager();
      this.renderManager.init(wideCanvas);

      entityList.push(new Entity());

      entityList.forEach(function(e) {
        e.init();

        var image     = new Image();
        image.onload  = function() {
          e.image = image;
        };
        image.src     = "app/img/playerA.png";

        e.physicsBody = new PhysicsBody({
          x:0,
          y:0,
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
    };
    this.update = function() {
      entityList.forEach(function(e) {
        e.update();
      });
    };
    this.checkCollision = function () {

    };
    this.draw = function() {
      this.renderManager.render(entityList);
    };
    this.init(); // constructor call
  };
  return GameState;
});