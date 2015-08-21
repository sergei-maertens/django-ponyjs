// With Mocha we want to describe the module/component/behavior we are testing
// with a describe block - describe('Component', function() { })
describe('Test-setup', function() {
    before(function() {
        // Karma creates this global __html__ property that will hold all
        // of our HTML so we can populate the body during our tests
        if (window.__html__) {
            document.body.innerHTML = window.__html__['test/index.html'];
        }
    });

    // Now we describe the adding behavior of the calculator module
    describe('Adding', function() {
        // What should it do?
        it('calculation works', function() {
            chai.expect(calc(2, 3)).to.equal(5);
        });
   });
   // describe('Subtraction', function() {
   //     @todo
   // });
});