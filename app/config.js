require.config({
});

require(['main', 'lib/requestanimationframe'], function(main) {
  'use strict';
  main.start();
});



