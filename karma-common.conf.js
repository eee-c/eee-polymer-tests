exports.mixin_common_opts = function(karma, opts) {
  var all_opts = {

    // base path, that will be used to resolve files and exclude
    basePath: '',


    // frameworks to use
    frameworks: ['jasmine'],

    // START: karma_changes
    /**
     * Compile HTML into JS so that they can be used as templates
     */
    preprocessors: {
      'test/*.html': 'html2js'
    },

    /**
     * Don't include Polymer HTML and JS because Polymer is very
     * particular about the order in which they are added. Serve them,
     * but defer loading to the test setup. Include test HTML
     * fixtures.
     */
    // list of files / patterns to load in the browser
    files: [
      'bower_components/platform/platform.js',
      'test/PolymerSetup.js',
      {pattern: 'elements/**', included: false, served: true},
      {pattern: 'bower_components/**', included: false, served: true},
      'test/**/*Spec.js'
    ],
    // END: karma_changes

    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
    logLevel: karma.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  };
  for (var key in opts) {
  	all_opts[key] = opts[key];
  }
  return all_opts;
};
