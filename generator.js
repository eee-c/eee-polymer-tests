#!/usr/bin/env node

if (/node_modules\/eee-polymer-tests/.test(process.cwd())) {
  // Need to run the generator from the element package, not from the
  // installed node module
  process.chdir('../..');
}

var fs = require('fs');
var readline = require('readline');
var parseArgs = require('minimist');
require('colors');

var KARMA_CONF = 'karma.conf.js';
var POLYMER_SETUP = 'test/PolymerSetup.js';

var element, force;

parseCommandLine();
if (element) {
  generate();
}
else {
  queryForElementName();
}

function generate() {
  console.log("\nGenerating test setup for: " + element);

  ensureTestDirectory();
  if (okKarmaConf()) generateKarmaConf();
  if (okPolymerSetup()) generatePolymerSetup();
  if (okTestSkeleton()) generateTestSkeleton();

  console.log("Done!\n");
}

function ensureTestDirectory() {
  if (fs.existsSync('test')) return;
  fs.mkdirSync('test');
}

function generateKarmaConf() {
  fs.createReadStream(__dirname + '/templates/karma.conf.js').
    pipe(fs.createWriteStream(KARMA_CONF));
}

function okKarmaConf() {
  return _okOverwrite(KARMA_CONF);
}

function generatePolymerSetup() {
  var template = __dirname + '/templates/PolymerSetup.js';
  fs.readFile(template, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    var content = data.replace(/\{\{element-name\}\}/g, element);
    fs.writeFile(POLYMER_SETUP, content);
  });
}

function okPolymerSetup() {
  return _okOverwrite(POLYMER_SETUP);
}

function generateTestSkeleton() {
  var template = __dirname + '/templates/SkeletonSpec.js';
  fs.readFile(template, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    var content = data.replace(/\{\{element-name\}\}/g, element);
    fs.writeFile(_testFilename(), content);
  });
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
