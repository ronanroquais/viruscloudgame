/*jshint maxerr: 10 */
//undefined to make sure the undefined var is really undefined.
define(function(require)
{
  'use strict';
  var IntroState = require('introState');
  var MovementHelper = require('movementHelper');
  var interactions = require('lib/mouseInteractions');
  var SelectState = require('selectState');
  var GameState = require('gameState');
  var crosspads = require('lib/crosspads');
  var settings = require('settings');
  var properties = require('properties');

  var Game = function(){
    //var showDebug = false;
    var currentState;
    var totalMatches = 0;
   

    this.onKeyDown = function(e)
    {
      window.game.actOnKey(e.keyCode, true);
    };

    this.onKeyUp = function(e)
    {
      window.game.actOnKey(e.keyCode, false);
    };

    this.init = function()
    {
      window.addEventListener('keydown', this.onKeyDown, true);
      window.addEventListener('keyup', this.onKeyUp, true);
    
      this.p1Keys = new MovementHelper(['W','S','A','D','Space','R','T','F','G']);//{keyLeft:65, keyAction:82, keyAction2:84, keyRight:68, keyDown: 83, keyUp:87});
      this.p2Keys = new MovementHelper(['I','K','J','L','Shift','O','P',';',"'"]);//{keyLeft:74, keyAction:80, keyAction2:219, keyRight:76, keyDown: 75, keyUp:73});
    
      this.startIntroState();
    };
    
    this.actOnKey = function(keyCode, pressed) // PROBLEME DEPENDANCE CIRCULAIRE
    {
      this.p1Keys.update(keyCode, pressed);
      this.p2Keys.update(keyCode, pressed);
    };

    this.hasPad = function(index)
    {
      return crosspads.isPadConnected(index);
    }

    this.getKeysString = function(index)
    {
      var usingPad = this.hasPad(index);
      switch(index)
      {
        case 0:
          if(usingPad)
            return "Gamepad 1, DPad - A B";
          else 
            return "W A S D - R T - Space";
          break;
        case 1:
        default:
          if(usingPad)
            return "Gamepad 2, DPad - A B"
          else 
            return "I J K L - O P - Shift";
          break;
      }
    }
    this.getActionKeyString = function(index)
    {
      if(this.hasPad(index))
      {
        return "Start";
      }
      else
      {
        switch(index)
        {
          case 0:
            return "Space";
            break;
          case 1:
          default:
            return "Shift";
        }
      }
    }

    this.startIntroState = function()
    {
      this.p1Keys.reset();
      this.p2Keys.reset();
      currentState = new IntroState(this);
    };

    this.startSelectState = function()
    {
      this.p1Keys.reset();
      this.p2Keys.reset();
      currentState = new SelectState(this);
    };

    this.startGameState = function()
    {
      this.p1Keys.reset();
      this.p2Keys.reset();
      totalMatches += 1;
      if(properties.isP1Active && properties.isP2Active)
        currentState = new VersusGameState(this);
      else currentState = new SoloGameState(this);
    };

    this.gameLoop = function()
    {
      crosspads.update();
      if(crosspads.pads[0])
      {
        var pad = crosspads.getChromePad(0);
        this.p1Keys.gamepadUpdate(pad.axes[0], pad.buttons[14], pad.buttons[15], pad.axes[1], pad.buttons[12], pad.buttons[13], pad.buttons[9], pad.buttons[0], pad.buttons[1], pad.buttons[2], pad.buttons[3]);
      }
      if(crosspads.pads[1])
      {
        var pad2 = crosspads.getChromePad(1); 
        this.p2Keys.gamepadUpdate(pad2.axes[0], pad2.buttons[14], pad2.buttons[15], pad2.axes[1], pad2.buttons[12], pad2.buttons[13], pad2.buttons[9], pad2.buttons[0], pad2.buttons[1], pad2.buttons[2], pad2.buttons[3]);
      }
      if(currentState)
      {
        currentState.takeInput(this.p1Keys, this.p2Keys);
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
  window.game = new Game(window.settings);
  return window.game;

});