/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    haml: {                           
      dist: {                            
        files: {                         
          '../public/index.html': 'src/index.haml'
        }
      }
    },

    // Task configuration.
    coffee: {
      options: {
        bare: true
      },
      compile: {
        expand: true,
        //flatten: true,
        cwd: 'src/coffeescripts/',
        src: ['**/*.coffee'],
        dest: 'src/javascripts/',
        ext: '.js'
      }
    },

    sass: {
      compile: {
        files: {
          '../public/stylesheets/style.css' : 'src/sass/style.sass'
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          name: 'main',
          baseUrl: 'src/javascripts',
          mainConfigFile: 'src/javascripts/config.js',
          out: '../public/javascripts/main-built.js',
          optimize: "none"
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8080,
          base: 'dist',
          keepalive: true
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        // beautify: true,
        // mangle: false,
        compress: {
          // drop_debugger: false,
          global_defs: {
            DEBUG: false
          }
        }
      },
      dist: {
        src: 'src/javascripts/main-built.js',
        dest: '../public/javascripts/main-built.js'
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },

      gruntfile: {
        src: 'Gruntfile.js'
      },

      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },

    qunit: {
      files: ['test/**/*.html']
    },

    watch: {
      doreload: {
        options: {
          livereload: true,
        },
        files: ['../public/**/*']
      },
      dist: {
        files: ['src/index.haml', 'src/coffeescripts/**/*.coffee', 'src/sass/**/*.sass'],
        tasks: ['dist'] 
      },
      // gruntfile: {
      //   files: '<%= jshint.gruntfile.src %>',
      //   tasks: ['jshint:gruntfile']
      // },
      // lib_test: {
      //   files: '<%= jshint.lib_test.src %>',
      //   tasks: ['jshint:lib_test', 'qunit']
      // }
    },

    copy: {
      assets: {
        files: [
          // includes files within path
          //{expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

          // includes files within path and its sub-directories
          //{expand: false, src: ['src/images/**/*'], dest: 'dist/images/'},

          // makes all src relative to cwd
          {expand: true, cwd: 'src/images/', src: ['**'], dest: '../public/images/'},
          {expand: true, cwd: 'src/lib/', src: ['**'], dest: '../public/javascripts/lib'},

          // flattens results to a single level
          //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
        ],
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-haml2html');
  grunt.loadNpmTasks('grunt-contrib-copy');

  //grunt.registerTask('default', ['haml', 'coffee', 'requirejs', 'jshint', 'qunit', 'uglify']);
  grunt.registerTask('dist', ['haml', 'sass', 'coffee', 'requirejs', 'copy:assets']);//, 'uglify']);
  grunt.registerTask('default', 'dist');
};
