/****
Chrome :
  Axes :
    0 : LR1
    1 : UD1
    2 : LR2
    3 : UD2
  Buttons :
    0 : A
    1 : B
    2 : X
    3 : Y
    4 : LB
    5 : RB
    6 : LT (Analog)
    7 : RT (Analog)
    8 : Select
    9 : Start
    10 : LP
    11 : RP
    12 : D-Up
    13 : D-Down
    14 : D-Left
    15 : D-Right

Firefox :
  Axes :
    0 : LR1
    1 : UD1
    2 : RT-LT
    3 : LR2
    4 : UD2
    5 : D-LeftRight
    6 : D-UpDown
  Buttons:
    0 : A
    1 : B
    2 : X
    3 : Y
    4 : LB
    5 : RB
    6 : Select
    7 : Start
    8 : LP
    9 : RP

****/
'use strict';
var Crosspads = function()
{
  var usingChromeStyle = !!navigator.webkitGetGamepads;
  console.log("can use chrome gamepads ? " + usingChromeStyle);
  //There was an array called webkitGamepads[] before august 2012

  this.pads = [undefined, undefined, undefined, undefined];
  this.update = function()
  {
    if(usingChromeStyle)
    {
      this.pads = navigator.webkitGetGamepads();
    }
  };
  this.isPadConnected = function(index)
  {
    return !!this.pads[index];
  };
  this.hasAnyPadConnected = function()
  {
    return (this.pads[0] || this.pads[1] || this.pads[2] || this.pads[3]);
  };
  this.getChromePad = function(index)
  {
    if(usingChromeStyle)
    {
      return this.pads[index];
    }
    else
    {
      var mozPad = this.pads[index];
      var chromePad;// = undefined;
      if(mozPad)
      {
        chromePad = {
          index : mozPad.index,
          axes : [
            mozPad.axes[0],
            mozPad.axes[1],
            mozPad.axes[3],
            mozPad.axes[4]
          ],
          buttons : [
            mozPad.buttons[0].value,
            mozPad.buttons[1].value,
            mozPad.buttons[2].value,
            mozPad.buttons[3].value,
            mozPad.buttons[4].value,
            mozPad.buttons[5].value,
            Math.max(mozPad.axes[2], 0), // Mozilla doesn't support both LT and RT pressed at the same time.
            Math.abs(Math.min(mozPad.axes[2] , 0)), // and takes RT before LT, lol.
            mozPad.buttons[6].value,
            mozPad.buttons[7].value,
            mozPad.buttons[8].value,
            mozPad.buttons[9].value,
            Math.abs(Math.min(mozPad.axes[6] , 0)),
            Math.max(mozPad.axes[6], 0),
            Math.abs(Math.min(mozPad.axes[5] , 0)),
            Math.max(mozPad.axes[5], 0)
          ]
        };
      }
      return chromePad;
    }
  };
  this.getMozPad = function(index)
  {
    if(!usingChromeStyle)
    {
      return this.pads[index];
    }
    else
    {
      var mozPad;// = undefined;
      var chromePad = this.pads[index];
      if(chromePad)
      {
        mozPad = {
          index : chromePad.index,
          connected : true,
          axes : [
            chromePad.axes[0],
            chromePad.axes[1],
            (chromePad.buttons[6] - chromePad.buttons[7]),
            chromePad.axes[2],
            chromePad.axes[3],
            (chromePad.buttons[15] - chromePad.buttons[14]),
            (chromePad.buttons[13] - chromePad.buttons[12])
          ],
          buttons : [
            { value : chromePad.buttons[0], pressed : chromePad.buttons[0] > 0.2},
            { value : chromePad.buttons[1], pressed : chromePad.buttons[1] > 0.2},
            { value : chromePad.buttons[2], pressed : chromePad.buttons[2] > 0.2},
            { value : chromePad.buttons[3], pressed : chromePad.buttons[3] > 0.2},
            { value : chromePad.buttons[4], pressed : chromePad.buttons[4] > 0.2},
            { value : chromePad.buttons[5], pressed : chromePad.buttons[5] > 0.2},
            { value : chromePad.buttons[8], pressed : chromePad.buttons[8] > 0.2},
            { value : chromePad.buttons[9], pressed : chromePad.buttons[9] > 0.2},
            { value : chromePad.buttons[10], pressed : chromePad.buttons[10] > 0.2},
            { value : chromePad.buttons[11], pressed : chromePad.buttons[11] > 0.2}
          ]
        };
      }
      return mozPad;
    }
  };
  this.getXBoxPad = function(index)
  {
    var xBoxPad;// = undefined;
    if(usingChromeStyle)
    {
      var chromePad = this.pads[index];
      if(chromePad)
      {
        xBoxPad = {
          index : chromePad.index,
          leftStick : {
            leftRight : chromePad.axes[0],
            upDown : chromePad.axes[1]
          },
          rightStick : {
            leftRight : chromePad.axes[2],
            upDown :chromePad.axes[3]
          },
          dPad : {
            up : 12,
            down : 13,
            left : 14,
            right : 15
          },
          buttons : {
            A : chromePad.buttons[0],
            B : chromePad.buttons[1],
            X : chromePad.buttons[2],
            Y : chromePad.buttons[3],
            LB : chromePad.buttons[4],
            RB : chromePad.buttons[5],
            LT : chromePad.buttons[6],
            RT : chromePad.buttons[7],
            SELECT : chromePad.buttons[8],
            START : chromePad.buttons[9],
            LP : chromePad.buttons[10],
            RP : chromePad.buttons[11]
          }
        };
      }
    }
    else
    {
      var mozPad = this.pads[index];
      if(mozPad)
      {
        xBoxPad = {
          index : mozPad.index,
          leftStick : {
            leftRight : mozPad.axes[0],
            upDown : mozPad.axes[1]
          },
          rightStick : {
            leftRight : mozPad.axes[3],
            upDown :mozPad.axes[4]
          },
          dPad : {
            up : Math.abs(Math.min(mozPad.axes[6] , 0)),
            down : Math.max(mozPad.axes[6], 0),
            left : Math.abs(Math.min(mozPad.axes[5] , 0)),
            right : Math.max(mozPad.axes[5], 0)
          },
          buttons : {
            A : mozPad.buttons[0].value,
            B : mozPad.buttons[1].value,
            X : mozPad.buttons[2].value,
            Y : mozPad.buttons[3].value,
            LB : mozPad.buttons[4].value,
            RB : mozPad.buttons[5].value,
            LT : Math.max(mozPad.axes[2], 0),
            RT : Math.abs(Math.min(mozPad.axes[2] , 0)),
            SELECT : mozPad.buttons[6].value,
            START : mozPad.buttons[7].value,
            LP : mozPad.buttons[8].value,
            RP : mozPad.buttons[9].value
          }
        };
      }
    }
    return xBoxPad;
  };
};
var crosspads = new Crosspads();
var gamepadConnected = function(e)
{
  crosspads.pads[e.gamepad.index] = e.gamepad;
};
var gamepadDisconnected = function(e) {
  crosspads.pads[e.gamepad.index] = undefined;
};
window.addEventListener("gamepadconnected", gamepadConnected);
window.addEventListener("gamepaddisconnected", gamepadDisconnected);
module.exports = crosspads;