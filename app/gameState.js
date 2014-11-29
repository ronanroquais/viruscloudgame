define(function(require) {
  'use strict';
  // gameState
  var wideCanvas = require('lib/wideCanvas');
  var settings = require('settings');
  var Jar = require('jar');
  var levels = require('levels');

  var VersusGameState = function(gameCallbacks)
  {
    var jar1 = new Jar({x: 20, y: 10});
    var jar2 = new Jar({x: 430, y: 10});
    var levelState = 0;
    var innertimer = 0;
    var isActive = false;
    var p1Level = 1;
    var p2Level = 1;
    var p1LastAction = 0;
    var p2LastAction = 0;
    this.init = function() {
      levelState = 0;
      innertimer = 0;
      jar1.init();
      if(!properties.isP1Active)
        jar1.isAlive = false;
      jar2.init();
      if(!properties.isP2Active)
        jar2.isAlive = false;
      jar1.levels = levels.versus;
      jar2.levels = levels.versus;
      isActive = true;
    };
    
    this.initRound = function() {
      jar1.initRound();
      jar2.initRound();
    };
    
    this.isGameFinished = function() 
    {
    };
      
    this.takeInput = function(p1Keys, p2Keys)
    {
      if(levelState == 0 && innertimer > settings.fps)
      {
        if(jar1.isAlive)
        {
          if(jar1.currentLevel<0)
          {
            if(p1Keys.up())
            {
              if(p1LastAction != -1)
              {
                p1LastAction = -1;
                p1Level --;
              }
            }
            else if(p1Keys.down())
            {
              if( p1LastAction != 1 )
              {
                p1LastAction = 1;
                p1Level++;
              }
            }
            else p1LastAction =0;
            p1Level = Math.max(0, Math.min(2, p1Level));
            if(p1Keys.start() || p1Keys.A())
            {
              jar1.currentLevel = p1Level;
            }
          }
        }
        if(jar2.isAlive)
        {
          if(jar2.currentLevel<0)
          {
            if(p2Keys.up())
            {
              if(p2LastAction != -1)
              {
                p2LastAction = -1;
                p2Level --;
              }
            }
            else if(p2Keys.down())
            {
              if( p2LastAction != 1 )
              {
                p2LastAction = 1;
                p2Level++;
              }
            }
            else p2LastAction = 0;
            p2Level = Math.max(0, Math.min(2, p2Level));
            if(p2Keys.start() || p2Keys.A())
            {
              jar2.currentLevel = p2Level;
            }
          }
        }
      }
      else if(levelState == 1)
      {
        return;
      }
      else
      {
        if(jar1.isAlive)
        {
          jar1.takeInput(p1Keys);
        }
        if(jar2.isAlive)
        {
          jar2.takeInput(p2Keys);
        }
        if(!jar1.isAlive || !jar2.isAlive)
        {
          if((properties.isP1Active && p1Keys.start())
            || (properties.isP2Active && p2Keys.start()))
          {
            gameCallbacks.startIntroState();
          }
        }
      }
    };
    this.update = function() {
      innertimer++;
      //if(innertimer > settings.fps)
      if(levelState == 0 && jar1.currentLevel >= 0 && jar2.currentLevel >= 0)
      {
        levelState = 1;
        innertimer = 0;
        this.initRound();
      }

      if(levelState == 1 && innertimer > settings.fps)
        levelState = 2;

      if(levelState < 2)
        return;

      if(!isActive)
        return;
      if(jar1.isAlive && jar2.isAlive)
      {
        if(jar1.itemsToSendToEnemy > 0)
        {
          jar2.penaltyItemsToAdd+= jar1.itemsToSendToEnemy;
          jar1.itemsToSendToEnemy = 0;
        }
        if(jar2.itemsToSendToEnemy > 0)
        {
          jar1.penaltyItemsToAdd+= jar2.itemsToSendToEnemy;
          jar2.itemsToSendToEnemy = 0;
        }
      }
      else return;
      jar1.update();
      jar2.update();
      this.checkCollision();
      /*if(innertimer > 30 * settings.fps && innertimer < 5 * 60 * settings.fps)
      {

      }*/
    };
    this.checkCollision = function () {
      jar1.checkCollision();
      jar2.checkCollision();
    };
    this.draw = function() {
      wideCanvas.clear();
      wideCanvas.ctx.fillStyle= "#222";
      wideCanvas.ctx.fillRect(settings.width/2 - 4, 0, 8, settings.height)
      jar1.draw();
      jar2.draw();
      if(levelState == 0)
      {

        wideCanvas.ctx.font="18px Arial";
        wideCanvas.ctx.fillStyle = "#222";
        wideCanvas.ctx.strokeStyle= "#222";
        wideCanvas.ctx.strokeRect(60, 100, 150, 60);
        wideCanvas.ctx.strokeRect(60, 200, 150, 60);
        wideCanvas.ctx.strokeRect(60, 300, 150, 60);

        wideCanvas.ctx.strokeStyle = "#e00";
        wideCanvas.ctx.lineWidth=3;
        wideCanvas.ctx.fillStyle = "transparent";
        if(jar1.currentLevel>0)
          wideCanvas.ctx.fillStyle = "#800";
        switch(p1Level)
        {
        case 0 :
        wideCanvas.ctx.fillRect(60, 100, 150, 60);
        wideCanvas.ctx.strokeRect(60, 100, 150, 60);
          break;
        case 1 :
        wideCanvas.ctx.fillRect(60, 200, 150, 60);
        wideCanvas.ctx.strokeRect(60, 200, 150, 60);
        break;
        case 2 :
        default:
        wideCanvas.ctx.fillRect(60, 300, 150, 60);
        wideCanvas.ctx.strokeRect(60, 300, 150, 60);
        }
        wideCanvas.ctx.lineWidth=1;
        wideCanvas.ctx.fillStyle = "#222";
        wideCanvas.ctx.fillText("BEGINNER", 135, 135);
        wideCanvas.ctx.fillText("NORMAL", 135, 235);
        wideCanvas.ctx.fillText("MASTER", 135, 335);


        wideCanvas.ctx.font="18px Arial";
        wideCanvas.ctx.fillStyle = "#222";
        wideCanvas.ctx.strokeStyle= "#222";
        wideCanvas.ctx.strokeRect(settings.hCenter + 60, 100, 150, 60);
        wideCanvas.ctx.strokeRect(settings.hCenter + 60, 200, 150, 60);
        wideCanvas.ctx.strokeRect(settings.hCenter + 60, 300, 150, 60);

        wideCanvas.ctx.strokeStyle = "#e00";
        wideCanvas.ctx.lineWidth=3;
        wideCanvas.ctx.fillStyle = "transparent";
        if(jar2.currentLevel>0)
          wideCanvas.ctx.fillStyle = "#800";
        switch(p2Level)
        {
        case 0 :
        wideCanvas.ctx.fillRect(settings.hCenter + 60, 100, 150, 60);
        wideCanvas.ctx.strokeRect(settings.hCenter + 60, 100, 150, 60);
          break;
        case 1 :
        wideCanvas.ctx.fillRect(settings.hCenter + 60, 200, 150, 60);
        wideCanvas.ctx.strokeRect(settings.hCenter + 60, 200, 150, 60);
        break;
        case 2 :
        default:
        wideCanvas.ctx.fillRect(settings.hCenter + 60, 300, 150, 60);
        wideCanvas.ctx.strokeRect(settings.hCenter + 60, 300, 150, 60);
        }
        wideCanvas.ctx.lineWidth=1;
        wideCanvas.ctx.fillStyle = "#222";
        wideCanvas.ctx.fillText("BEGINNER", settings.hCenter + 135, 135);
        wideCanvas.ctx.fillText("NORMAL", settings.hCenter + 135, 235);
        wideCanvas.ctx.fillText("MASTER", settings.hCenter + 135, 335);
        //jar1.drawGetReady();
        //jar2.drawGetReady();
      }
      if(!jar1.isAlive
        || !jar2.isAlive)
      {
        wideCanvas.ctx.fillStyle = "#222";
        wideCanvas.ctx.strokeStyle = "#888";
        wideCanvas.ctx.font = "24px Arial";
        wideCanvas.ctx.textAlign = "center";
        wideCanvas.ctx.strokeText("Press Start for next round", settings.width/2, settings.height/2 + 25);
        wideCanvas.ctx.fillText("Press Start for next round", settings.width/2, settings.height/2 + 25);

        var jar1Txt = "GAME OVER";
        if(jar1.isAlive)
          jar1Txt = "YOU WIN !";
        var jar2Txt = "GAME OVER";
        if(jar1.isAlive)
          jar2Txt = "YOU WIN !";
        wideCanvas.ctx.fillText(jar1Txt, settings.width/4, settings.height/3);
        wideCanvas.ctx.fillText(jar2Txt, settings.width*3/4, settings.height/3);
      }
    };
    this.init(); // appel du constructeur
  };
  return VersusGameState;
});