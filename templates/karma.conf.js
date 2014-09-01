module.exports = function(config) {
  var common = require('./node_modules/eee-polymer-tests/karma-common.conf.js');

  config.set(common.mixin_common_opts(config, {
    // Override common settings here...
  }));
};
