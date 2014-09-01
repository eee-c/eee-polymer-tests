#!/usr/bin/env node

var fs = require('fs');

var element = process.argv[2];
var camel = element.
  split(/-/).
  map(function(t) { return t.charAt(0).toUpperCase() + t.slice(1); }).
  join('');

// checkForExistingFiles();
ensureTestDirectory();
generateKarmaConf();
generatePolymerSetup();
generateTestSkeleton();

function checkForExistingFiles() {
  console.log("Not implemented");
  process.exit(1);
}

function ensureTestDirectory() {
  if (fs.existsSync('test')) return;
  fs.mkdirSync('test');
}

function generateKarmaConf() {
  fs.createReadStream(__dirname + '/templates/karma.conf.js').
    pipe(fs.createWriteStream('karma.conf.js'));
}

function generatePolymerSetup() {
  var template = __dirname + '/templates/PolymerSetup.js';
  fs.readFile(template, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    var filename = './test/PolymerSetup.js';
    var content = data.replace(/\{\{element-name\}\}/g, element);
    fs.writeFile(filename, content);
  });
}

function generateTestSkeleton() {
  var template = __dirname + '/templates/SkeletonSpec.js';
  fs.readFile(template, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    var filename = './test/' + camel + 'Spec.js';
    var content = data.replace(/\{\{element-name\}\}/g, element);
    fs.writeFile(filename, content);
  });
}
