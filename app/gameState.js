define(function(require) {
  'use strict';
  // gameState
  var wideCanvas = require('lib/wideCanvas');
  var settings = require('settings');
  var Jar = require('jar');
  var levels = require('levels');

  var GameState = function(gameCallbacks)
  {

    this.init = function() {
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
  return VersusGameState;
});