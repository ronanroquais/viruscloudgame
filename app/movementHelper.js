define(function(){
  'use strict';
  var MovementHelper = function(options)
  {
    this.keysStr = options;
    this.keys = [];

    this.actions = {
        up : false,
        down : false,
        left : false,
        right : false,
        start : false,
        A : false,
        B : false,
        X : false,
        Y : false
      }; // left, action, right, up, action2, down //up down left right start A B X Y
    
    this.specialKeys = [];
    this.specialKeys[9] = "Tab";
    this.specialKeys[13] = "Enter";
    this.specialKeys[16] = "Shift";
    this.specialKeys[17] = "CTRL";
    this.specialKeys[18] = "Alt";
    this.specialKeys[19] = "Pause";
    this.specialKeys[20] = "Caps Lock";
    this.specialKeys[27] = "Escape";
    this.specialKeys[32] = "Space";
    this.specialKeys[33] = "Page Up";
    this.specialKeys[34] = "Page Down";
    this.specialKeys[35] = "End";
    this.specialKeys[36] = "Home";
    this.specialKeys[37] = "Left Arrow";
    this.specialKeys[38] = "Up Arrow";
    this.specialKeys[39] = "Right Arrow";
    this.specialKeys[40] = "Down Arrow";
    this.specialKeys[45] = "Insert";
    this.specialKeys[46] = "Delete";

    this.init = function()
    {
      for (var i = this.keysStr.length - 1; i >= 0; i--)
      {
        if(this.keysStr[i].length == 1)
        {
          this.keys[i] = this.keysStr[i].charCodeAt(0);
        }
        else
        {
          this.keys[i] = this.specialKeys.indexOf(this.keysStr[i]);
        }
      };
    }

    this.init();

    this.update = function(keyCode, pressed){
      var actionIndex = this.keys.indexOf(keyCode);
      if(actionIndex != -1)
      {
        switch(actionIndex)
        {
          case 0:
            this.setUp(pressed);
            break;
          case 1:
            this.setDown(pressed);
            break;
          case 2:
            this.setLeft(pressed);
            break;
          case 3:
            this.setRight(pressed);
            break;
          case 4:
            this.setStart(pressed);
            break;
          case 5:
            this.setA(pressed);
            break;
          case 6:
            this.setB(pressed);
            break;
          case 7:
            this.setX(pressed);
            break;
          case 8:
            this.setY(pressed);
            break;
          default:
        }
        //this.actions[actionIndex] = pressed;
      }
    };
    this.gamepadUpdate = function(axisX, left, right, axisY, up, down, start, A, B, X, Y)
    {
      this.setA(A);
      this.setB(B);
      this.setStart(start);
      this.setX(X);
      this.setY(Y);
      if(Math.abs(axisX) > 0.25)
      {
        this.setLeft(axisX < -0.2);
        this.setRight(axisX > 0.2);
      }
      else
      {
        this.setLeft(left);
        this.setRight(right);
      }
      if(Math.abs(axisY) > 0.25)
      {
        this.setUp(axisY < -0.2);
        this.setDown(axisY > 0.2);
      }
      else
      {
        this.setUp(up);
        this.setDown(down);
      }
    };
    this.reset = function()
    {
      this.actions = this.getEmptyActionsObject();
    };
    this.left = function()
    {
      return this.actions.left;
    };
    this.A = function()
    {
      return this.actions.A;
    };
    this.right = function ()
    {
      return this.actions.right;
    };
    this.up = function()
    {
      return this.actions.up;
    };
    this.B = function()
    {
      return this.actions.B;
    };
    this.down = function ()
    {
      return this.actions.down;
    };
    this.start = function()
    {
      return this.actions.start;
    };
    this.setLeft = function(pressed)
    {
      this.actions.left = pressed;
    };
    this.setA = function(pressed)
    {
      this.actions.A = pressed;
    };
    this.setRight = function(pressed)
    {
      this.actions.right = pressed;
    };
    this.setUp = function(pressed)
    {
      this.actions.up = pressed;
    };
    this.setB = function(pressed)
    {
      this.actions.B = pressed;
    };
    this.setX = function(pressed)
    {
      this.actions.X = pressed;
    }
    this.setY = function(pressed)
    {
      this.actions.Y = pressed;
    }
    this.setDown = function(pressed)
    {
      this.actions.down = pressed;
    };
    this.setStart = function(pressed)
    {
      this.actions.start = pressed;
    }
    this.getEmptyActionsObject = function()
    {
      return {
        up : false,
        down : false,
        left : false,
        right : false,
        start : false,
        A : false,
        B : false,
        X : false,
        Y : false
      }
    }
    this.setActions = function(actionsArray)
    {
        this.actions = actionsArray;
    };
    /*    

    this.getKeyCode = function(stringEntry)
    {
      //allegly ripped off from cambiaresearch.com
      var result = String.fromCharCode(charCode);
      if (stringEntry == "backspace") return 8; //  backspace
      if (charCode == 9) textBox.value = "tab"; //  tab
     if (charCode == 13) textBox.value = "enter"; //  enter
     if (charCode == 16) textBox.value = "shift"; //  shift
     if (charCode == 17) textBox.value = "ctrl"; //  ctrl
     if (charCode == 18) textBox.value = "alt"; //  alt
     if (charCode == 19) textBox.value = "pause/break"; //  pause/break
     if (charCode == 20) textBox.value = "caps lock"; //  caps lock
     if (charCode == 27) textBox.value = "escape"; //  escape
     if (charCode == 33) textBox.value = "page up"; // page up, to avoid displaying alternate character and confusing people           
     if (charCode == 34) textBox.value = "page down"; // page down
     if (charCode == 35) textBox.value = "end"; // end
     if (charCode == 36) textBox.value = "home"; // home
     if (charCode == 37) textBox.value = "left arrow"; // left arrow
     if (charCode == 38) textBox.value = "up arrow"; // up arrow
     if (charCode == 39) textBox.value = "right arrow"; // right arrow
     if (charCode == 40) textBox.value = "down arrow"; // down arrow
   if (charCode == 45) textBox.value = "insert"; // insert
   if (charCode == 46) textBox.value = "delete"; // delete
   if (charCode == 91) textBox.value = "left window"; // left window
   if (charCode == 92) textBox.value = "right window"; // right window
   if (charCode == 93) textBox.value = "select key"; // select key
   if (charCode == 96) textBox.value = "numpad 0"; // numpad 0
   if (charCode == 97) textBox.value = "numpad 1"; // numpad 1
   if (charCode == 98) textBox.value = "numpad 2"; // numpad 2
   if (charCode == 99) textBox.value = "numpad 3"; // numpad 3
   if (charCode == 100) textBox.value = "numpad 4"; // numpad 4
   if (charCode == 101) textBox.value = "numpad 5"; // numpad 5
   if (charCode == 102) textBox.value = "numpad 6"; // numpad 6
   if (charCode == 103) textBox.value = "numpad 7"; // numpad 7
   if (charCode == 104) textBox.value = "numpad 8"; // numpad 8
   if (charCode == 105) textBox.value = "numpad 9"; // numpad 9
   if (charCode == 106) textBox.value = "multiply"; // multiply
   if (charCode == 107) textBox.value = "add"; // add
   if (charCode == 109) textBox.value = "subtract"; // subtract
   if (charCode == 110) textBox.value = "decimal point"; // decimal point
   if (charCode == 111) textBox.value = "divide"; // divide
   if (charCode == 112) textBox.value = "F1"; // F1
   if (charCode == 113) textBox.value = "F2"; // F2
   if (charCode == 114) textBox.value = "F3"; // F3
   if (charCode == 115) textBox.value = "F4"; // F4
   if (charCode == 116) textBox.value = "F5"; // F5
   if (charCode == 117) textBox.value = "F6"; // F6
   if (charCode == 118) textBox.value = "F7"; // F7
   if (charCode == 119) textBox.value = "F8"; // F8
   if (charCode == 120) textBox.value = "F9"; // F9
   if (charCode == 121) textBox.value = "F10"; // F10
   if (charCode == 122) textBox.value = "F11"; // F11
   if (charCode == 123) textBox.value = "F12"; // F12
   if (charCode == 144) textBox.value = "num lock"; // num lock
   if (charCode == 145) textBox.value = "scroll lock"; // scroll lock
   if (charCode == 186) textBox.value = ";"; // semi-colon
   if (charCode == 187) textBox.value = "="; // equal-sign
   if (charCode == 188) textBox.value = ","; // comma
   if (charCode == 189) textBox.value = "-"; // dash
   if (charCode == 190) textBox.value = "."; // period
   if (charCode == 191) textBox.value = "/"; // forward slash
   if (charCode == 192) textBox.value = "`"; // grave accent
   if (charCode == 219) textBox.value = "["; // open bracket
   if (charCode == 220) textBox.value = "\\"; // back slash
   if (charCode == 221) textBox.value = "]"; // close bracket
   if (charCode == 222) textBox.value = "'"; // single quote


    }

    this.getCharFromKeycode = function(keycode)
    {

      if (charCode == 8) textBox.value = "backspace"; //  backspace
      if (charCode == 9) textBox.value = "tab"; //  tab
      if (charCode == 13) textBox.value = "enter"; //  enter
      if (charCode == 16) textBox.value = "shift"; //  shift
      if (charCode == 17) textBox.value = "ctrl"; //  ctrl
      if (charCode == 18) textBox.value = "alt"; //  alt
      if (charCode == 19) textBox.value = "pause/break"; //  pause/break
      if (charCode == 20) textBox.value = "caps lock"; //  caps lock
      if (charCode == 27) textBox.value = "escape"; //  escape
      if (charCode == 33) textBox.value = "page up"; // page up, to avoid displaying alternate character and confusing people           
      if (charCode == 34) textBox.value = "page down"; // page down
      if (charCode == 35) textBox.value = "end"; // end
      if (charCode == 36) textBox.value = "home"; // home
      if (charCode == 37) textBox.value = "left arrow"; // left arrow
      if (charCode == 38) textBox.value = "up arrow"; // up arrow
      if (charCode == 39) textBox.value = "right arrow"; // right arrow
      if (charCode == 40) textBox.value = "down arrow"; // down arrow
      if (charCode == 45) textBox.value = "insert"; // insert
      if (charCode == 46) textBox.value = "delete"; // delete
      if (charCode == 91) textBox.value = "left window"; // left window
      if (charCode == 92) textBox.value = "right window"; // right window
      if (charCode == 93) textBox.value = "select key"; // select key
      if (charCode == 96) textBox.value = "numpad 0"; // numpad 0
      if (charCode == 97) textBox.value = "numpad 1"; // numpad 1
      if (charCode == 98) textBox.value = "numpad 2"; // numpad 2
      if (charCode == 99) textBox.value = "numpad 3"; // numpad 3
      if (charCode == 100) textBox.value = "numpad 4"; // numpad 4
      if (charCode == 101) textBox.value = "numpad 5"; // numpad 5
      if (charCode == 102) textBox.value = "numpad 6"; // numpad 6
      if (charCode == 103) textBox.value = "numpad 7"; // numpad 7
      if (charCode == 104) textBox.value = "numpad 8"; // numpad 8
      if (charCode == 105) textBox.value = "numpad 9"; // numpad 9
      if (charCode == 106) textBox.value = "multiply"; // multiply
      if (charCode == 107) textBox.value = "add"; // add
      if (charCode == 109) textBox.value = "subtract"; // subtract
      if (charCode == 110) textBox.value = "decimal point"; // decimal point
      if (charCode == 111) textBox.value = "divide"; // divide
      if (charCode == 112) textBox.value = "F1"; // F1
      if (charCode == 113) textBox.value = "F2"; // F2
      if (charCode == 114) textBox.value = "F3"; // F3
      if (charCode == 115) textBox.value = "F4"; // F4
      if (charCode == 116) textBox.value = "F5"; // F5
      if (charCode == 117) textBox.value = "F6"; // F6
      if (charCode == 118) textBox.value = "F7"; // F7
      if (charCode == 119) textBox.value = "F8"; // F8
      if (charCode == 120) textBox.value = "F9"; // F9
      if (charCode == 121) textBox.value = "F10"; // F10
      if (charCode == 122) textBox.value = "F11"; // F11
      if (charCode == 123) textBox.value = "F12"; // F12
      if (charCode == 144) textBox.value = "num lock"; // num lock
      if (charCode == 145) textBox.value = "scroll lock"; // scroll lock
      if (charCode == 186) textBox.value = ";"; // semi-colon
      if (charCode == 187) textBox.value = "="; // equal-sign
      if (charCode == 188) textBox.value = ","; // comma
      if (charCode == 189) textBox.value = "-"; // dash
      if (charCode == 190) textBox.value = "."; // period
      if (charCode == 191) textBox.value = "/"; // forward slash
      if (charCode == 192) textBox.value = "`"; // grave accent
      if (charCode == 219) textBox.value = "["; // open bracket
      if (charCode == 220) textBox.value = "\\"; // back slash
      if (charCode == 221) textBox.value = "]"; // close bracket
      if (charCode == 222) textBox.value = "'"; // single quote
      return charCode;
    }*/
  };
  return MovementHelper;
});