define(function(require) {
  'use strict';
  // gameState
  var wideCanvas = require('lib/wideCanvas');
  var settings = require('settings');
  var Jar = require('jar');
  var levels = require('levels');

  var Entity = require('entity/entity');

  var GameState = function(gameCallbacks)
  {
    var entityList  = [];

    this.init = function() {
      entityList.push(new Entity());

      entityList.forEach(function(e) {
        e.init();
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
      wideCanvas.clear();
      wideCanvas.ctx.fillStyle= "#222";
      wideCanvas.ctx.fillRect(settings.width/2 - 4, 0, 8, settings.height)
    };
    this.init(); // constructor call
  };
  return GameState;
});