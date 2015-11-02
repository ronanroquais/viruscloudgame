'use strict';
var properties = require('./properties');
var settings = require('./settings');
var Selector = require('./selector');
var wideCanvas = require('./lib/wideCanvas');

var SelectState = function(gameCallbacks)
{
  var timerNextState = 0;
  var timerNextStateTarget = settings.fps * 1;
  var readyForNext = false;
  var p1Selector = new Selector({x: 170, y: 200, color: "#e00"});
  var p2Selector = new Selector({x: 620, y: 200, color: "#008"});
  var selectedOption = 0;
  var lastPlayer1Direction = 0;
  var lastPlayer2Direction = 0;
  this.takeInput = function(p1Keys, p2Keys) {
    properties.isP1Active |= p1Keys.start();
    if(properties.isP1Active)
    {
      p1Selector.takeInput(p1Keys);
      if(timerNextState>timerNextStateTarget)
      {
        readyForNext = p1Keys.start();
      }
      if(p1Keys.left())
      {
        if(lastPlayer1Direction != -1)
        {
          lastPlayer1Direction = -1;
          selectedOption--;
        }
      }
      else if(p1Keys.right())
      {
        if(lastPlayer1Direction != 1)
        {
          lastPlayer1Direction = 1;
          selectedOption++;
        }
      }
      else
      {
        lastPlayer1Direction = 0;
      }

      if(selectedOption < 0)
        selectedOption = 2;
      else if(selectedOption > 2)
        selectedOption = 0;
    }
    properties.isP2Active |= p2Keys.start();
    if(properties.isP2Active)
    {
      p2Selector.takeInput(p2Keys);
      if(timerNextState>timerNextStateTarget)
      {
        readyForNext = p2Keys.start();
      }
      if(p2Keys.left())
      {
        if(lastPlayer2Direction != -1)
        {
          lastPlayer2Direction = -1;
          selectedOption--;
        }
      }
      else if(p2Keys.right())
      {
        if(lastPlayer2Direction != 1)
        {
          lastPlayer2Direction = 1;
          selectedOption++;
        }
      }
      else
      {
        lastPlayer2Direction = 0;
      }
      if(selectedOption < 0)
        selectedOption = 2;
      else if(selectedOption > 2)
        selectedOption = 0;
    }
    if(properties.isP1Active && properties.isP2Active)
    {
      selectedOption = 2;
    }
  };
  this.update = function() {
    timerNextState++;
    //readyForNext = timerNextState > timerNextStateTarget;
    if(properties.isP1Active)
    {
      p1Selector.update();
    }
    if(properties.isP2Active)
    {
      p2Selector.update();
    }
    if(readyForNext)
    {
      properties.gameMode = selectedOption;
      gameCallbacks.startGameState();
    }
  };
  this.draw = function() {
    wideCanvas.clear();
    wideCanvas.ctx.fillStyle = "#222";
    wideCanvas.ctx.textAlign = "center";
    wideCanvas.ctx.font="30px Arial";
    wideCanvas.ctx.fillText("LUMI LUMI", settings.hCenter, settings.vCenter);
    wideCanvas.ctx.font="18px Arial";
    wideCanvas.ctx.fillText(settings.version, settings.hCenter, settings.vCenter + 30);

    /*if(properties.isP1Active)
    {
      p1Selector.draw();
    }
    else
    {
      wideCanvas.ctx.fillStyle = "#222";
      wideCanvas.ctx.fillText(gameCallbacks.getKeysString(0), settings.hCenter - settings.width/4, settings.vCenter+30);      
      wideCanvas.ctx.fillText("for Player One", settings.hCenter - settings.width/4, settings.vCenter+50);
      wideCanvas.ctx.fillText("Press "+gameCallbacks.getActionKeyString(0), settings.hCenter - settings.width/4, settings.vCenter+80);
    }
    if(properties.isP2Active)
    {
      p2Selector.draw();
    }
    else
    {
      wideCanvas.ctx.fillStyle = "#222";
      wideCanvas.ctx.fillText(gameCallbacks.getKeysString(1), settings.hCenter + settings.width/4, settings.vCenter+30);
      wideCanvas.ctx.fillText("for Player Two", settings.hCenter + settings.width/4, settings.vCenter+50);
      wideCanvas.ctx.fillText("Press "+gameCallbacks.getActionKeyString(1), settings.hCenter + settings.width/4, settings.vCenter+80);
    }*/

    wideCanvas.ctx.strokeStyle= "#222";
    wideCanvas.ctx.strokeRect(30, 30, settings.width / 4, settings.height - 60);
    wideCanvas.ctx.fillText("STORY", 30 + settings.width/8, settings.height/3);
    wideCanvas.ctx.strokeRect(settings.width/2 - settings.width/8, 30, settings.width / 4, settings.height - 60);
    wideCanvas.ctx.fillText("ENDLESS", settings.width/2, settings.height/3);
    wideCanvas.ctx.strokeRect(settings.width*3/4 - 30, 30, settings.width / 4, settings.height - 60);
    wideCanvas.ctx.fillText("VERSUS", settings.width*3/4 + settings.width/8, settings.height/3);

    wideCanvas.ctx.strokeStyle = "#e00";
    wideCanvas.ctx.lineWidth=3;
    switch(selectedOption)
    {
    case 0 :
      wideCanvas.ctx.strokeRect(30, 30, settings.width / 4, settings.height - 60);
      break;
    case 1 :
      wideCanvas.ctx.strokeRect(settings.width/2 - settings.width/8, 30, settings.width / 4, settings.height - 60);
    break;
    case 2 :
    default:
      wideCanvas.ctx.strokeRect(settings.width*3/4 - 30, 30, settings.width / 4, settings.height - 60);
    }
    wideCanvas.ctx.lineWidth=1;
    
    wideCanvas.ctx.fillStyle = "#222";
    //wideCanvas.ctx.fillText("Start in "+Math.ceil((timerNextStateTarget-timerNextState)/settings.fps), settings.hCenter, settings.vCenter+80);
  };
};
module.exports = SelectState;