define(function(require) {
  'use strict';
  var settings = {
    version : 0.1,
    width : 800,
    height : 400,
    canvasId : "c",
    fps : 30,
    solidPlayers : true,
    gravity : -10,
    canvasColor : "#222",
    backgroundColor : "#B0B0B0",
    winningRounds : 2,
    fallSpeed : 5
  };
  //helpers
  settings.hCenter = settings.width/2;
  settings.vCenter = settings.height/2;
  return settings;
});
