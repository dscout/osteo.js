module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['lib/osteo.js', 'lib/*.js', 'lib/**/*.js'],
        dest: 'osteo.js'
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      beforeconcat: ['lib/**/*.js'],
      afterconcat:  ['osteo.js']
    },

    uglify: {
      options: {
        report: 'gzip'
      },
      dist: {
        src: 'osteo.js',
        dest: 'osteo.min.js'
      }
    },

    mocha: {
      src: 'test/test.html',
      options: {
        bail: true,
        log: true,
        run: true,
        timeout: 1000,
        mocha: {
          ignoreLeaks: true
        }
      }
    },

    watch: {
      files: ['lib/**/*.js'],
      tasks: ['concat', 'jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('test',    ['concat', 'mocha']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('release', ['concat', 'mocha', 'uglify']);
};
