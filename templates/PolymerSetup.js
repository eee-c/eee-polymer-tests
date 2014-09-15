// 1. Load Polymer before any code that touches the DOM.
// *** This is done in karma.conf to avoid script loading race    ***
// *** conditions. It is OK to do it here once the Spec files are ***
// *** of non-trivial size.                                       ***
// var script = document.createElement("script");
// script.src = "/base/bower_components/platform/platform.js";
// document.getElementsByTagName("head")[0].appendChild(script);

// 2. Load component(s)
var link = document.createElement("link");
link.rel = "import";
link.href = "/base/elements/{{element-name}}.html";
document.getElementsByTagName("head")[0].appendChild(link);

// Delay Jasmine specs until Polymer is ready
var POLYMER_READY = false;
beforeEach(function(done) {
  function waitForPolymer() {
    if (Polymer && Polymer.whenReady) {
      Polymer.whenReady(done);
      return;
    }
    if (Polymer && Polymer.whenPolymerReady) {
      Polymer.whenPolymerReady(done);
      return;
    }
    setTimeout(waitForPolymer, 200);
  }
  waitForPolymer();

  if (POLYMER_READY) done();
});
