'use strict';
var MovementHelper = require('./movementHelper');
var crosspads = require('./lib/crosspads');

var InputManager = function ()
{
  this.keyStrokes = [];
  this.onKeyDown = function(e)
  {
    window.inputManager.actOnKey(e.keyCode, true);
  };

  this.onKeyUp = function(e)
  {
    window.inputManager.actOnKey(e.keyCode, false);
  };

  this.actOnKey = function(keyCode, pressed)
  {
    this.keyStrokes.push({keyCode: keyCode, pressed: pressed});
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
  this.init = function()
  {
    window.addEventListener('keydown', this.onKeyDown, true);
    window.addEventListener('keyup', this.onKeyUp, true);
    this.keys = [];
    this.keys.push(new MovementHelper(['W','S','A','D','Space','R','T','F','G']));//{keyLeft:65, keyAction:82, keyAction2:84, keyRight:68, keyDown: 83, keyUp:87});
    this.keys.push(new MovementHelper(['I','K','J','L','Shift','O','P',';',"'"]));//{keyLeft:74, keyAction:80, keyAction2:219, keyRight:76, keyDown: 75, keyUp:73});
    this.keys.push(new MovementHelper(['H','V','B','N','Shift','C','X',';',"'"]));//{keyLeft:74, keyAction:80, keyAction2:219, keyRight:76, keyDown: 75, keyUp:73});
  }

  this.resetKeys = function()
  {
    for (var i = 0; i < this.keys.length; i++) {
      this.keys[i].reset();
    };
    this.keyStrokes = [];
  };

  this.update = function()
  {
    //flushing the keys at once.
    for (var i = 0; i < this.keyStrokes.length; i++) {
      for (var p = 0; p < this.keys.length; p++) {
        this.keys[p].update(this.keyStrokes[i].keyCode, this.keyStrokes[i].pressed);
      };
    };
    for (var p = 0; p < this.keys.length; p++) {
      this.keys[p].updateStrokes();
    }
    this.keyStrokes = [];
    crosspads.update();
    if(crosspads.pads[0])
    {
      var pad = crosspads.getChromePad(0);
      this.keys[0].gamepadUpdate(pad.axes[0], pad.buttons[14], pad.buttons[15], pad.axes[1], pad.buttons[12], pad.buttons[13], pad.buttons[9], pad.buttons[0], pad.buttons[1], pad.buttons[2], pad.buttons[3]);
    }
    //else
    {
      //this.keys[0].hitUpdate();
    }
    if(crosspads.pads[1])
    {
      var pad2 = crosspads.getChromePad(1); 
      this.keys[1].gamepadUpdate(pad2.axes[0], pad2.buttons[14], pad2.buttons[15], pad2.axes[1], pad2.buttons[12], pad2.buttons[13], pad2.buttons[9], pad2.buttons[0], pad2.buttons[1], pad2.buttons[2], pad2.buttons[3]);
    }
//      else
    {
      //this.keys[1].hitUpdate();
    }
  };
  this.getKeys = function ()
  {
    return this.keys;
  };
};

window.inputManager = new InputManager();
module.exports = window.inputManager;
