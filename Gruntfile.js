// Wrapper function
module.exports = function (grunt) {

  // Configuration data
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    /* Clean */
    clean: {
      js: ['js/compiled'],
      inc: ['inc/compiled']
    },

    /* Uglify */
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/main.js',
        dest: 'inc/compiled/mainjs.min.inc'
      }
    },

    /* Requirejs for minifying all the js files */
    requirejs: {
      desktop: {
        options: {
          baseUrl: '.',
          paths: {
            'newsspec_4950/data' : './data',
            'newsspec_4950/module': './js/module',
            'newsspec_4950/bootstrap': './js/bootstrap-desktop',
            'raphael' : 'empty:',
            'jquery-1':"empty:",
            'istats-1':"empty:",
            'vendor':"./js/vendor"
          },
          name: 'newsspec_4950/module/app',
          out: 'js/compiled/desktop/project_all.js',
          optimize: 'uglify'
        }
      },
      mobile: {
        options: {
          baseUrl: '.',
          paths: {
            'newsspec_4950/data' : './data',
            'newsspec_4950/module': './js/module',
            'newsspec_4950/bootstrap': './js/bootstrap',
            'raphael' : 'empty:',
            'jquery': "empty:",
            'vendor/eventEmitter': 'empty:',
            'vendor/istats/istats': 'empty:',
            'vendor': 'js/vendor'
          },
          name: 'newsspec_4950/module/app',
          out: 'js/compiled/mobile/project_all.js',
          optimize: 'uglify'
        }
      }
    },

    /* Jshint for testing the syntax */
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true
      },
      all: ['js/*.js', 'js/module/*.js', 'spec/**/*.js']
    },
    sass: {
      dist: {
          files: {
              'css/main.css': 'sass/main.scss'
          },
          options: {
              style : 'compressed'
          }
      }
    },
    watch: {
      js: {
          files: ['js/module/*.js', 'spec/module/*spec.js'],
          tasks: ['jshint', 'jasmine']
      },
      css: {
          files: 'sass/*.scss',
          tasks: ['sass']
      },
      minify: {
          files: ['js/main.js'],
          tasks: ['jshint', 'uglify'],
      }
    },
    /* Jasmine for unit testing */
    jasmine: {
      desktop: {
        src: 'js/module/*.js',
        options: {
          keepRunner: true,
          specs: 'spec/module/*spec.js',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
              requireConfig: {
                  paths: {
                      'newsspec_4950/data' : './data',
                      'newsspec_4950/module': './js/module',
                      'newsspec_4950/bootstrap': './js/bootstrap-desktop',
                      'raphael': 'http://news.bbcimg.co.uk/news/special/shared/js/raphaeljs/amd/v1/raphael-min-amd',
                      'jquery-1': "../../../projects/grunt-specials-project-scaffold/vendor/libs/jquery-1.7.2",
                      'domReady': '../../../projects/grunt-specials-project-scaffold/vendor/libs/domReady',
                      'vendor/event_emitter': '../../../projects/grunt-specials-project-scaffold/vendor/events/eventEmitter',
                      'istats-1': '../../../projects/grunt-specials-project-scaffold/vendor/libs/istats-1',
                      'vendor': 'js/vendor'
                  }
              }
          }
      }
    }/*,
    mobile: {
      src: 'js/module/*.js',
      options: {
          specs: 'spec/module/*spec.js',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
              requireConfig: {
                  paths: {
                    'newsspec_4950/data' : './data',
                    'newsspec_4950/module': './js/module',
                    'newsspec_4950/bootstrap': './js/bootstrap',
                    'jquery': "../../../projects/grunt-specials-project-scaffold/vendor/jquery-2/jquery.min",
                    'vendor/event_emitter': '../../../projects/grunt-specials-project-scaffold/vendor/events/eventEmmiter',
                    'vendor/istats/istats': '../../../projects/grunt-specials-project-scaffold/vendor/istats/istats',
                    'vendor': 'js/vendor'
                  }
              }
          }
      }
    }*/
    },
    testem: {
        main : {
            src: [ 'testem.json' ]
        }
    },

    /* Copy for deploying */
    copy: {
      stage: {
        files: [
          {expand: true, src: ['css/**'], dest: '/Volumes/wwwlive/news/special/2013/newsspec_4950'},
          {expand: true, src: ['inc/**'], dest: '/Volumes/wwwlive/news/special/2013/newsspec_4950'},
          {expand: true, src: ['img/**'], dest: '/Volumes/wwwlive/news/special/2013/newsspec_4950'},
          {expand: true, src: ['j_inc/**'], dest: '/Volumes/wwwlive/news/special/2013/newsspec_4950'},
          {expand: true, src: ['js/compiled/**'], dest: '/Volumes/wwwlive/news/special/2013/newsspec_4950'}
        ]
      },
      live: {
        files: [
          {expand: true, src: ['css/**'], dest: '/Volumes/Inetpub/wwwlive/news/special/2013/newsspec_4950'},
          {expand: true, src: ['inc/**'], dest: '/Volumes/Inetpub/wwwlive/news/special/2013/newsspec_4950'},
          {expand: true, src: ['img/**'], dest: '/Volumes/Inetpub/wwwlive/news/special/2013/newsspec_4950'},
          {expand: true, src: ['j_inc/**'], dest: '/Volumes/Inetpub/wwwlive/news/special/2013/newsspec_4950'},
          {expand: true, src: ['js/compiled/**'], dest: '/Volumes/Inetpub/wwwlive/news/special/2013/newsspec_4950'}
        ]
      }

  }

  });

  // Load the plugin that provides the "uglify" task and many others...
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-testem');

  // Defining the tasks
  grunt.registerTask('stage', ['copy:stage']);
  grunt.registerTask('live', ['copy:live']);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('default', ['clean', 'uglify','requirejs', 'jshint']);


};