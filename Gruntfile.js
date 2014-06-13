module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['osteo.js']
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
      files: ['osteo.js'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('test',    ['mocha']);
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('release', ['jshint', 'mocha', 'uglify']);
};
