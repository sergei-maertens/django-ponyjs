// With Mocha we want to describe the module/component/behavior we are testing
// with a describe block - describe('Component', function() { })
describe('Test-setup', function() {
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