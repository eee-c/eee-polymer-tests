// Delay Jasmine specs until Polymer is ready
var POLYMER_READY = false;
beforeEach(function(done) {
  function waitForPolymer() {
    if (Polymer) {
      Polymer.whenReady(done);
      return;
    }
    setTimeout(waitForPolymer, 1000);
  }
  waitForPolymer();

  if (POLYMER_READY) done();
});

// 1. Load Polymer before any code that touches the DOM.
var script = document.createElement("script");
script.src = "/base/bower_components/platform/platform.js";
document.getElementsByTagName("head")[0].appendChild(script);

// 2. Load component(s)
var link = document.createElement("link");
link.rel = "import";
link.href = "/base/elements/{{element-name}}.html";
document.getElementsByTagName("head")[0].appendChild(link);
