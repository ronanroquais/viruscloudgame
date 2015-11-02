'use strict';
var settings = require('./settings');
var game = require('./game');
var start = function()
{
  game.init();
  timerLoop();
};
function timerLoop()
{
  window.game.gameLoop();
  window.game.drawLoop();
  setTimeout(function(){window.requestAnimationFrame(timerLoop);}, 1000 / settings.fps);
}

start();