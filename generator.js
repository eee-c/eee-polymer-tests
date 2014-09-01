#!/usr/bin/env node

var element = process.argv[2];

var fs = require('fs');
fs.readFile('./node_modules/eee-polymer-tests/templates/PolymerSetup.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  writeSetup(data);
});

function writeSetup(template) {
  var content = template.replace(/\{\{element-name\}\}/g, element);
  fs.writeFile('./test/PolymerSetup.js', content);
}
