define(function(require) {
  'use strict';
  var properties = require('properties');
  var settings = require('settings');
  var wideCanvas = require('lib/wideCanvas');
  //Intro state
  var IntroState = function(gameCallbacks)
  {
    var innerTimer = 0;
    properties.isP1Active = false;
    properties.isP2Active = false;
    this.takeInput = function(p1Keys, p2Keys) {
      if(innerTimer > settings.fps)
      {
        properties.isP1Active |= p1Keys.start();
        properties.isP2Active |= p2Keys.start();
        if(properties.isP1Active|| properties.isP2Active)
        {
          gameCallbacks.startSelectState();
        }
      }
    };
    this.update = function() {
      if(innerTimer < 10* settings.fps)
        innerTimer++;
    };
    this.draw = function() {
      wideCanvas.clear();
      wideCanvas.ctx.fillStyle = "#222";
      wideCanvas.ctx.textAlign = "center";
      wideCanvas.ctx.font="30px Arial";
      wideCanvas.ctx.fillText("LUMI LUMI", settings.hCenter, settings.vCenter);
      wideCanvas.ctx.font="18px Arial";
      wideCanvas.ctx.fillText(settings.version, settings.hCenter, settings.vCenter + 30);
      wideCanvas.ctx.fillText(gameCallbacks.getKeysString(0), settings.hCenter - settings.width/4, settings.vCenter+30);      
      wideCanvas.ctx.fillText("for Player One", settings.hCenter - settings.width/4, settings.vCenter+50);

      wideCanvas.ctx.fillText(gameCallbacks.getKeysString(1), settings.hCenter + settings.width/4, settings.vCenter+30);
      wideCanvas.ctx.fillText("for Player Two", settings.hCenter + settings.width/4, settings.vCenter+50);
      
      if(!gameCallbacks.hasPad(0) || !gameCallbacks.hasPad(1))
        wideCanvas.ctx.fillText("Supporting Gamepads. Press a button on a gamepad to activate it.", settings.hCenter, settings.vCenter+110);

      wideCanvas.ctx.fillText("Press "+gameCallbacks.getActionKeyString(0), settings.hCenter - settings.width/4, settings.vCenter+80);
      wideCanvas.ctx.fillText("Press "+gameCallbacks.getActionKeyString(1), settings.hCenter + settings.width/4, settings.vCenter+80);
      //debug de la souris
      //ctx.fillRect(mouseX, mouseY, 4,4);
    };
  };
  return IntroState;
});