#!/usr/bin/env node

if (/node_modules\/eee-polymer-tests/.test(process.cwd())) {
  // Need to run the generator from the element package, not from the
  // installed node module
  process.chdir('../..');
}

var fs = require('fs');
var readline = require('readline');
var tty = require('tty');
var parseArgs = require('minimist');
var bower = require('bower');
require('colors');

var KARMA_CONF = 'karma.conf.js';
var POLYMER_SETUP = 'test/PolymerSetup.js';
var DOTFILE = '.eee-polymer-tests-generated';

var element, force;

parseCommandLine();

if (fs.existsSync(DOTFILE) && !force) {
  console.log('The spec generator has already been run. Won\'t overwrite without --force.');
  process.exit(0);
}

if (element) {
  generate();
  process.exit(0);
}

queryForElementName();

function generate() {
  console.log("\nGenerating test setup for: " + element);

  ensureTestDirectory();
  if (okKarmaConf()) generateKarmaConf();
  if (okPolymerSetup()) generatePolymerSetup();
  if (okTestSkeleton()) generateTestSkeleton();
  if (okBower()) generateBower();
  generateDotFile();
  okElements();

  console.log("Done!\n");
}

function ensureTestDirectory() {
  if (fs.existsSync('test')) return;
  fs.mkdirSync('test');
}

function generateKarmaConf() {
  var content = fs.
    readFileSync(__dirname + '/templates/karma.conf.js', 'utf8');
  fs.writeFileSync(KARMA_CONF, content);
}

function okKarmaConf() {
  return _okOverwrite(KARMA_CONF);
}

function generatePolymerSetup() {
  var template = __dirname + '/templates/PolymerSetup.js';
  var content = fs.
    readFileSync(template, 'utf8').
    replace(/\{\{element-name\}\}/g, element);

  fs.writeFileSync(POLYMER_SETUP, content);
}

function okPolymerSetup() {
  return _okOverwrite(POLYMER_SETUP);
}

function generateTestSkeleton() {
  var template = __dirname + '/templates/SkeletonSpec.js';
  var content = fs.
    readFileSync(template, 'utf8').
    replace(/\{\{element-name\}\}/g, element);

  fs.writeFileSync(_testFilename(), content);
}

function okTestSkeleton() {
  return _okOverwrite(_testFilename());
}

function _testFilename() {
  var camel = element.
    split(/-/).
    map(function(t) { return t.charAt(0).toUpperCase() + t.slice(1); }).
    join('');

  return  'test/' + camel + 'Spec.js';
}

function okElements() {
  if (!fs.existsSync('elements')) {
    var message = '[WARN] There is no elements subdirectory for Polymer ' +
                  'elements. Tests will fail!';
    console.log(message.red);
    return false;
  }
  if (!fs.existsSync('elements/' + element + '.html')) {
    var message = '[WARN] There is no elements/' + element + '.html ' +
                  'element to be tested. Tests will fail!';
    console.log(message.red);
    return false;
  }
  return true;
}

function generateBower() {
  var npmJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  var bowerJson = {
    "name": npmJson.name,
    "version": "0.0.0",
    "description": npmJson.description,
    "ignore": [
      "**/.*",
      "node_modules",
      "bower_components",
      "test",
      "tests"
    ],
    "dependencies": {
      "polymer": "Polymer/polymer"
    }
  };

  fs.writeFileSync('bower.json', JSON.stringify(bowerJson, undefined, 2));

  bower.commands
    .install()
    .on('end', function (installed) {
        console.log('Polymer installed');
     });
}

function okBower() {
  return _okOverwrite('bower.json');
}

function generateDotFile() {
  fs.openSync(DOTFILE, 'w');
}

function _okOverwrite(filename) {
  if (!fs.existsSync(filename)) return true;

  if (force) {
    var message = 'Force overwrite: ' + filename + '.';
    console.log(message);
    return true;
  }

  var message = '[WARN] File exists: ' + filename + '.' +
                ' (use --force to overwrite)';
  console.log(message.yellow);
  return false;
}

function parseCommandLine() {
  if (process.argv.length <= 2) return;
  var argv = parseArgs(process.argv.slice(2), {
    'boolean': 'force help'
  });
  if (argv._.length != 1) return;

  if (argv.help) {
    showHelp();
    process.exit(0);
  }

  element = argv._[0];
  force = argv.force;
}

function queryForElementName() {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("What is the name of the Polymer element being tested? ",
   function(answer) {
     element = answer.replace(/[<>]*/g, '');

     generate();
     showHelp();

     rl.close();
  });
}

function showHelp() {
  console.log(
    (
      "The Polymer test generator can be re-run with: " +
      "./node_modules/eee-polymer-tests/generator.js <x-element-name>\n"
    ).
      green.
      bold
  );
}
