
'use strict';
var wideCanvas = require("./lib/wideCanvas");
var settings = require("./settings");
var Menu = function(options) 
{
  this.margin = 10;
  this.init = function() {
    options = options || {};
    options.x = options.x || settings.hCenter;
    options.y = options.y || settings.vCenter;
    this.items = options.items;
    this.lineHeight = options.lineHeight || 20;
    options.height = options.height || ( settings.height - options.y );
    this.setPosition(options.x, options.y, options.height);
    this.selectedLine = 0;
  };
  this.setPosition = function (x, y, height)
  {
    this.x = x;
    this.y = y;
    this.height = height;
  }
  this.takeInput = function(keys)
  {
    if(keys[0].upHit())
    {
      this.selectedLine = Math.max(this.selectedLine-1, 0);
    }
    else if(keys[0].downHit())
    {
      this.selectedLine = Math.min(this.selectedLine+1, this.items.length-1);
    }
    if(keys[0].AHit() || keys[0].StartHit())
    {
      console.log(keys[0].actionsHit.start);
      console.log(keys[0].StartHit());
      if(!this.items[this.selectedLine].isOption)
        this.items[this.selectedLine].callback();
    }
  }
  this.update = function()
  {

  }
  this.draw = function()
  {
    var currentY = this.lineHeight;
    wideCanvas.ctx.font = this.lineHeight + "px Arial";
    for(var i = 0; i < this.items.length; i++)
    {
      if(currentY + this.lineHeight < this.height)
      {
        if(this.selectedLine == i)
          wideCanvas.ctx.fillStyle = "#FFF";
        else
          wideCanvas.ctx.fillStyle = "#222";

        if(this.items[i].isOption)
        {
          wideCanvas.ctx.textAlign = "right";
          wideCanvas.ctx.fillText(this.items[i].title, this.x - this.margin, this.y + currentY);
          //if(this.items[i].optionType == "all")
          {
            wideCanvas.ctx.textAlign = "left";
            var x = this.margin;
            for (var v = 0; v < this.items[i].values.length; v++) {
              var txtLength = wideCanvas.ctx.measureText(this.items[i].values[v]);
              wideCanvas.ctx.fillText(String(this.items[i].values[v]), this.x + x, this.y + currentY);
              x += txtLength + this.margin;
            };
          }
        }
        else
        {
          wideCanvas.ctx.textAlign = "center";
          wideCanvas.ctx.fillText(this.items[i].title, this.x, this.y+currentY);
        }
        currentY += this.lineHeight;
      }
      else break;
    }
  }

  this.init();
}

module.exports = Menu;