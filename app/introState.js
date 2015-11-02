'use strict';
var properties = require('./properties');
var settings = require('./settings');
var wideCanvas = require('./lib/wideCanvas');
var Menu = require('./menu');
//Intro state
var IntroState = function(gameCallbacks)
{
  var innerTimer = 0;
  properties.isP1Active = false;
  properties.isP2Active = false;
  var localState = 0;
  this.init = function() {
    localState = 0;
    this.menu = new Menu(
      {
        y: (0.75*settings.height),
        items : [
          {
            title : "NEW GAME",
            callback : this.startGame
          },
          {
            title : "OPTIONS",
            callback : this.startGame
          },
          {
            title : "BONUS",
            callback : this.startGame
          }
        ]
      });
  }
  this.takeInput = function(keys) {
    var p1Keys = keys[0];
    var p2Keys = keys[1];
    if(innerTimer > settings.fps)
    {
      if(localState == 0)
      {
        properties.isP1Active |= p1Keys.StartHit();
        properties.isP2Active |= p2Keys.StartHit();
        if(properties.isP1Active || properties.isP2Active)
        {
          localState=1;
        }
      }
      else
      {
        this.menu.takeInput(keys);
      }
    }
  };
  this.startGame = function() {
    gameCallbacks.startGameState();
  }
  this.update = function() {
    if(innerTimer < 10* settings.fps)
      innerTimer++;
    this.menu.update();
  };
  this.draw = function() {
    wideCanvas.clear();
    wideCanvas.ctx.fillStyle = "#222";
    wideCanvas.ctx.textAlign = "center";
    wideCanvas.ctx.font="30px Arial";
    wideCanvas.ctx.fillText("DuplicApp", settings.hCenter, settings.vCenter);
    wideCanvas.ctx.font="18px Arial";
    wideCanvas.ctx.fillText(settings.version, settings.hCenter, settings.vCenter + 30);
    wideCanvas.ctx.fillText(gameCallbacks.getKeysString(0), settings.hCenter - settings.width/4, settings.vCenter+30);      
    wideCanvas.ctx.fillText("for Player One", settings.hCenter - settings.width/4, settings.vCenter+50);

    wideCanvas.ctx.fillText(gameCallbacks.getKeysString(1), settings.hCenter + settings.width/4, settings.vCenter+30);
    wideCanvas.ctx.fillText("for Player Two", settings.hCenter + settings.width/4, settings.vCenter+50);
    if(localState == 0)
    {
      if(!gameCallbacks.hasPad(0) || !gameCallbacks.hasPad(1))
        wideCanvas.ctx.fillText("Supporting Gamepads. Press a button on a gamepad to activate it.", settings.hCenter, settings.vCenter+110);

      wideCanvas.ctx.fillText("Press "+gameCallbacks.getActionKeyString(0), settings.hCenter - settings.width/4, settings.vCenter+80);
      wideCanvas.ctx.fillText("Press "+gameCallbacks.getActionKeyString(1), settings.hCenter + settings.width/4, settings.vCenter+80);
    }
    else
    {
      this.menu.draw(); 
    }
    //debug de la souris
    //ctx.fillRect(mouseX, mouseY, 4,4);
  };

  this.init();
};
module.exports = IntroState;