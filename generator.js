#!/usr/bin/env node

if (/node_modules\/eee-polymer-tests/.test(process.cwd())) {
  // Need to run the generator from the element package, not from the
  // installed node module
  process.chdir('../..');
}

var fs = require('fs');
var readline = require('readline');

var element, camel;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What is the name of the Polymer element being tested? ", function(answer) {
  element = answer.replace(/[<>]*/g, '');
  camel = element.
    split(/-/).
    map(function(t) { return t.charAt(0).toUpperCase() + t.slice(1); }).
    join('');

  console.log("Generating test setup for: ", element);
  generate();
  console.log("Done!");

  rl.close();
});

function generate() {
  // checkForExistingFiles();
  ensureTestDirectory();
  generateKarmaConf();
  generatePolymerSetup();
  generateTestSkeleton();
}

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
