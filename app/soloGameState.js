define(function(require) {
  'use strict';
  // gameState
  var wideCanvas = require('lib/wideCanvas');
  var settings = require('settings');
  var properties = require('properties');
  var Jar = require('jar');
  var levels = require('levels');

  var SoloGameState = function(gameCallbacks)
  {
    var jar1 = new Jar({x: 272, y: 10});
    var levelState = 0;
    var innertimer = 0;
    var currentLevel = 0;
    this.init = function() {
      levelState = 0;
      innertimer = 0;
      jar1.init();
      if(properties.gameMode == 0)
        jar1.levels = levels.story;
      else jar1.levels = levels.endless;
      jar1.currentLevel = 0;
    };
    
    this.initRound = function() {
    };
    
    this.isGameFinished = function() 
    {
    };
      
    this.takeInput = function(p1Keys, p2Keys)
    {
      if(levelState == 0)
        return;

      var keys = p1Keys;
      if(properties.isP2Active)
        keys = p2Keys; //One player only
      if(jar1.isAlive)
      {
        jar1.takeInput(keys);
      }
      if(!jar1.isAlive)
      {
        if(p1Keys.start()
          || p2Keys.start())
        {
          gameCallbacks.startIntroState();
        }
      }
    };
    this.update = function() {
      innertimer++;
      if(innertimer > settings.fps)
        levelState = 1;
      if(levelState == 0)
        return;

      jar1.update();
      this.checkCollision();
      /*if(innertimer > 30 * settings.fps && innertimer < 5 * 60 * settings.fps)
      {

      }*/
    };
    this.checkCollision = function () {
      jar1.checkCollision();
    };
    this.draw = function() {
      wideCanvas.clear();
      jar1.draw();
      if(levelState == 0)
      {
        jar1.drawGetReady();
      }
      if(!jar1.isAlive)
      {
        wideCanvas.ctx.fillStyle = "#222";
        wideCanvas.ctx.strokeStyle = "#888";
        wideCanvas.ctx.font = "50px Arial";
        wideCanvas.ctx.textAlign = "center";
        wideCanvas.ctx.strokeText("GAME OVER", settings.width/2, settings.height/2 + 25);
        wideCanvas.ctx.fillText("GAME OVER", settings.width/2, settings.height/2 + 25);
      }
    };
    this.init(); // appel du constructeur
  };
  return SoloGameState;
});