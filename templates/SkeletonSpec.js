describe('<{{element-name}}>', function(){
  var el, container;

  beforeEach(function(done){
    container = document.createElement("div");
    container.innerHTML = '<{{element-name}}></{{element-name}}>';
    document.body.appendChild(container);
    el = document.querySelector('{{element-name}}');

    setTimeout(done, 0); // One event loop for elements to register in Polymer
  });

  afterEach(function(){
    document.body.removeChild(container);
  });

  describe('element content', function(){
    beforeEach(function(done){
      // Maybe do some prep work here...
      setTimeout(done, 0); // One event loop for Polymer to process
    });
    it('has a shadow DOM', function(){
      expect(el.shadowRoot).not.toBe(null);
    });
  });
});
