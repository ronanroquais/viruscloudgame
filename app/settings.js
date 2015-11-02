'use strict';
var settings = {
  version : 0.1,
  width : 1024,
  height : 600,
  canvasId : "c",
  fps : 30,
  solidPlayers : true,
  gravity : -6,
  canvasColor : "#222",
  backgroundColor : "#228022",
  jumpVelocity : 30,
  runVelocity : 8,
  runAccel : 2,
  OWNER_PLAYER_A : "owner_player_a",
  OWNER_PLAYER_B : "owner_player_b",
  OWNER_PLAYER_C : "owner_player_c",
  OWNER_PLAYER_D : "owner_player_d",
  OWNER_NPC      : "owner_npc",
  OWNER_PLATFORM : "owner_platform"
};
//helpers
settings.hCenter = settings.width/2;
settings.vCenter = settings.height/2;
module.exports = settings;