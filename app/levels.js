'use strict';
var settings = require("./settings");
var Levels = function ()
{

  var levelsContent = [
    [
      { x:100, y:200, owner: settings.OWNER_PLAYER_A },
      { x:700, y:200, owner: settings.OWNER_PLAYER_B },
      { x:400, y:200, owner: settings.OWNER_PLAYER_C },

      { x:400, y:100, owner: settings.OWNER_NPC },
      { x:400, y:400, owner: settings.OWNER_NPC },
      { x:500, y:300, owner: settings.OWNER_NPC },
      { x:300, y:300, owner: settings.OWNER_NPC },
      { x:250, y:200, owner: settings.OWNER_NPC },
      { x:550, y:100, owner: settings.OWNER_NPC },

      { x:400, y:300, owner: settings.OWNER_PLATFORM },
      { x:290, y:220, owner: settings.OWNER_PLATFORM },
      { x:510, y:220, owner: settings.OWNER_PLATFORM },
      { x:100, y:150, owner: settings.OWNER_PLATFORM },
      { x:700, y:150, owner: settings.OWNER_PLATFORM },
      { x:250, y:50,  owner: settings.OWNER_PLATFORM },
      { x:550, y:50,  owner: settings.OWNER_PLATFORM }
    ],
    [
      { x:50,  y:200, owner: settings.OWNER_PLAYER_A },
      { x:750, y:200, owner: settings.OWNER_PLAYER_B },

      { x:400, y:100, owner: settings.OWNER_NPC },
      { x:400, y:400, owner: settings.OWNER_NPC },
      { x:225, y:200, owner: settings.OWNER_NPC },
      { x:225, y:300, owner: settings.OWNER_NPC },
      { x:575, y:200, owner: settings.OWNER_NPC },
      { x:575, y:300, owner: settings.OWNER_NPC },

      { x:400, y:50,  owner: settings.OWNER_PLATFORM },
      { x:400, y:230, owner: settings.OWNER_PLATFORM },
      { x:50,  y:200, owner: settings.OWNER_PLATFORM },
      { x:750, y:200, owner: settings.OWNER_PLATFORM },
      { x:220, y:120, owner: settings.OWNER_PLATFORM },
      { x:220, y:300, owner: settings.OWNER_PLATFORM },
      { x:580, y:120, owner: settings.OWNER_PLATFORM },
      { x:580, y:300, owner: settings.OWNER_PLATFORM }
    ],
    [
      { x:100, y:0, owner: settings.OWNER_PLAYER_A },
      { x:700, y:0, owner: settings.OWNER_PLAYER_B },

      { x:100, y:400, owner: settings.OWNER_NPC },
      { x:700, y:400, owner: settings.OWNER_NPC },
      { x:500, y:300, owner: settings.OWNER_NPC },
      { x:300, y:300, owner: settings.OWNER_NPC },
      { x:700, y:200, owner: settings.OWNER_NPC },
      { x:100, y:200, owner: settings.OWNER_NPC },

      { x:100, y:300, owner: settings.OWNER_PLATFORM },
      { x:700, y:300, owner: settings.OWNER_PLATFORM },
      { x:290, y:220, owner: settings.OWNER_PLATFORM },
      { x:510, y:220, owner: settings.OWNER_PLATFORM },
      { x:100, y:150, owner: settings.OWNER_PLATFORM },
      { x:700, y:150, owner: settings.OWNER_PLATFORM },
      { x:250, y:60,  owner: settings.OWNER_PLATFORM },
      { x:550, y:60,  owner: settings.OWNER_PLATFORM }
    ]
  ]
  this.getLevel = function(index, entityTypes) {
    var result = levelsContent[index];
    result = this.buildLevel(result, entityTypes);
    // create test platform
    /*result.push(
      this._createEntity(
        { x:650, y:150, width:100, height:20, isFixed:true },
        OWNER_PLATFORM
      )
    );
    */
    return result;
  };

  this.buildLevel = function (levelElts, entityTypes)
  {
    var result = [];
    for (var i = 0; i < levelElts.length; i++)
    {
      if(levelElts[i].owner == settings.OWNER_PLATFORM)
      {
        var localX = (levelElts[i].x);
        result.push({
          width: 100,
          height: 20,
          x : localX,
          y : levelElts[i].y,
          isFixed : true,
          owner : settings.OWNER_PLATFORM
        });
        console.log(result);
      }
      else
      {
        result.push({
          width : 32,
          height : 32,
          x : levelElts[i].x,
          y : levelElts[i].y,
          owner : levelElts[i].owner
        });
      }
    };
    return result;
  }
}
window.levels = new Levels();
module.exports = window.levels;