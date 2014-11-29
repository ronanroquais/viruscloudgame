define(function(require) {
  'use-strict';
  var wideCanvas = require('lib/wideCanvas');
  var settings = require('settings');

  var Selector = function(options)
  {
    this.x = options.x;
    this.y = options.y;
    this.color = options.color;
    var width = 240;
    var height = 100;
    this.percent = 0;
    this.increment = 1.0 / settings.fps;
    this.progressing = false;
    this.takeInput = function(keys)
    {
      this.lastInput = keys;
    }
    this.update = function()
    {
      if(this.percent > 1.0)
        this.percent = 1.0;
      if(this.percent == 1.0)
        return;
      if(this.progressing)
      {
        this.percent += this.increment;
      }
      else
      {
        this.percent -= this.increment;
      }
      if(this.percent < 0.0)
        this.percent = 0.0;
    }

    this.draw = function()
    {
      if(!this.lastInput)
        return;
      var baseX = this.x - width/2;
      var baseY = this.y;
      wideCanvas.ctx.strokeStyle = "#222";
      wideCanvas.ctx.strokeRect(this.x - width/2, this.y, width, height);
      wideCanvas.ctx.fillStyle = this.color;
      var heightFilled = height*this.percent;
      wideCanvas.ctx.fillRect(this.x - width/2, this.y + (height - heightFilled), width, heightFilled);

      wideCanvas.ctx.fillStyle = settings.backgroundColor;
      if(this.lastInput.left())
        wideCanvas.ctx.fillStyle = this.color;
      wideCanvas.ctx.fillRect(baseX + 10, baseY+40, 25, 25);
      wideCanvas.ctx.strokeRect(baseX + 10, baseY+40, 25, 25);

      wideCanvas.ctx.fillStyle = settings.backgroundColor;
      if(this.lastInput.up())
        wideCanvas.ctx.fillStyle = this.color;
      wideCanvas.ctx.fillRect(baseX + 40, baseY+10, 25, 25);
      wideCanvas.ctx.strokeRect(baseX + 40, baseY+10, 25, 25);

      wideCanvas.ctx.fillStyle = settings.backgroundColor;
      if(this.lastInput.down())
        wideCanvas.ctx.fillStyle = this.color;
      wideCanvas.ctx.fillRect(baseX + 40, baseY+70, 25, 25);
      wideCanvas.ctx.strokeRect(baseX + 40, baseY+70, 25, 25);

      wideCanvas.ctx.fillStyle = settings.backgroundColor;
      if(this.lastInput.right())
        wideCanvas.ctx.fillStyle = this.color;
      wideCanvas.ctx.fillRect(baseX + 70, baseY+40, 25, 25);
      wideCanvas.ctx.strokeRect(baseX + 70, baseY+40, 25, 25);

      wideCanvas.ctx.fillStyle = settings.backgroundColor;
      if(this.lastInput.start())
        wideCanvas.ctx.fillStyle = this.color;
      wideCanvas.ctx.fillRect(baseX + 113, baseY+60, 30, 20);
      wideCanvas.ctx.strokeRect(baseX + 113, baseY+60, 30, 20);

      wideCanvas.ctx.fillStyle = settings.backgroundColor;
      if(this.lastInput.A())
        wideCanvas.ctx.fillStyle = this.color;
      wideCanvas.ctx.fillRect(baseX + 160, baseY+35, 35, 35);
      wideCanvas.ctx.strokeRect(baseX + 160, baseY+35, 35, 35);

      wideCanvas.ctx.fillStyle = settings.backgroundColor;
      if(this.lastInput.B())
        wideCanvas.ctx.fillStyle = this.color;
      wideCanvas.ctx.fillRect(baseX + 200, baseY+35, 35, 35);
      wideCanvas.ctx.strokeRect(baseX + 200, baseY+35, 35, 35);
    }

    this.isFull = function()
    {
      return this.percent >= 1.0;
    }
  };
  return Selector;
});