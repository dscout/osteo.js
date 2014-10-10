
module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['mocha', 'browserify', 'chai-sinon'],

    files: [
      'test/**/*.js'
    ],

    exclude: [],

    client: {
      mocha: {
        ui: 'bdd'
      }
    },

    preprocessors: {
      'test/**/*.js': ['browserify']
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['Firefox'],

    singleRun: false
  });
};
