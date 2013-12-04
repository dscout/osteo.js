module.exports = function(grunt) {
  grunt.initConfig({
    coffee: {
      compile: {
        options: {
          bare: false,
          join: true
        },
        files: {
          'osteo.js': ['lib/osteo.coffee'],
          'test/osteo_test.js': ['test/*.coffee']
        }
      }
    },

    uglify: {
      options: {
        report: 'min'
      },
      dist: {
        src: 'osteo.js',
        dest: 'osteo.min.js'
      }
    },

    mocha: {
      src: ['test/test.html'],
      options: {
        bail: true,
        log: true,
        run: true,
        mocha: {
          ignoreLeaks: true
        }
      }
    },

    watch: {
      files: ['lib/*.coffee', 'test/*.coffee'],
      tasks: ['coffee:compile']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('test',    ['coffee:compile', 'mocha']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('release', ['coffee:compile', 'mocha', 'uglify']);
};
