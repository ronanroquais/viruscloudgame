// to depend on a bower installed component:
// define(['bower_components/componentName/file'])
define(function(require) {
  'use strict';
  var settings = require('settings');
  var game = require('game');
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

  return {
    start: start
  };

});