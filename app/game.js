'use strict';
var IntroState = require('./introState');
var SelectState = require('./selectState');
var GameState = require('./gameState');
var inputManager = require('./inputManager');

var Game = function(){
  //var showDebug = false;
  var currentState;
  var totalMatches = 0;

  this.init = function()
  {
    inputManager.init();
    this.startIntroState();
  };

  this.hasPad = function(index)
  {
    return inputManager.hasPad(index);
  }

  this.getKeysString = function(index)
  {
    return inputManager.getKeysString(index);
  }
  this.getActionKeyString = function(index)
  {
    return inputManager.getActionKeyString(index);
  }

  this.startIntroState = function()
  {
    inputManager.resetKeys();
    currentState = new IntroState(this);
  };

  this.startSelectState = function()
  {
    inputManager.resetKeys();
    currentState = new SelectState(this);
  };

  this.startGameState = function()
  {
    inputManager.resetKeys();
    currentState = new GameState(this);
  };

  this.gameLoop = function()
  {
    inputManager.update();
    if(currentState)
    {
      currentState.takeInput(inputManager.getKeys());
      currentState.update();
    }
  };

  this.drawLoop = function ()
  {
    if(currentState)
    {
      currentState.draw();
    }
  }

};

window.game = new Game();
module.exports = window.game;