module.exports = function(grunt) {
 'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist/*.js']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true,
        separator: ';'
      },
      dist: {
        src: ['app/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
    },
    //'<%= concat.dist.dest %>',
    uglify: {
      options: {
        banner: '<%= banner %> /*<%= grunt.template.today("dd-mm-yyyy") %>*/\n'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
//      files: ['app/*.js'],
      app: {
        options: {
          jshintrc: 'app/.jshintrc'
        },
        src: ['app/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
      liveDevel: {
        src: ['app/**/*.js'],
        options: {
          jshintrc: 'app/.jshintrc'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      app: {
        files: '<%= jshint.app.src %>',
        tasks: ['jshint:app', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      liveDevel: {
        files: '<%= jshint.app.src %>',
        tasks: ['jshint:app'],
        options: {
          nospawn: true,
          livereload: '<%= connect.development.livereload %>'
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          name: 'config',
          baseUrl: './app/',
          mainConfigFile: 'app/config.js',
          out: 'dist/viruscloud.js',
          optimize: 'uglify'
        }
      }
    },
    connect: {
      development: {
        options: {
          keepalive: false,
          livereload: 1337,
          port: 1337,
          hostname: '0.0.0.0'
        },
        // Livereload needs connect to insert a cJavascript snippet
        // in the pages it serves. This requires using a custom connect middleware
        middleware: function(connect, options) {
          return [
            // Load the middleware provided by the livereload plugin
            // that will take care of inserting the snippet
            require('grunt-contrib-watch/lib/utils').livereloadSnippet,
           
            // Serve the project folder
            connect.static(options.base)
          ];
        }
      },
      production: {
        options: {
          keepalive: true,
          port: 8000,
          middleware: function(connect, options) {
            return [
              // rewrite requirejs to the compiled version
              function(req, res, next) {
                if (req.url === '/components/requirejs/require.js') {
                  req.url = '/dist/require.min.js';
                }
                next();
              },
              connect.static(options.base),

            ];
          }
        }
      }
    }
  });

  /*grunt.event.on('watch', function(action, filepath, target) {
    grunt.config(['jshint', 'liveDevel', 'src'], [filepath]);
    grunt.log.write('jshinting: '+grunt.config(['jshint', 'liveDevel', 'src']));
  });*/

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task. // removed qunit
  grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify']);
  grunt.registerTask('devel', ['jshint', 'qunit', 'connect:development']);
  grunt.registerTask('liveDevel', ['connect:development', 'watch:liveDevel']);
  grunt.registerTask('distrib', ['requirejs']);
  grunt.registerTask('iphone', ['irequirejs']);
  grunt.registerTask('preview', ['connect:development']);
  grunt.registerTask('preview-live', ['default', 'connect:production']);

};
