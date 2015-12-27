/* global beforeEach, describe, expect, it */
'use strict';

import Manager from 'ponyjs/models/manager';


describe('Model Manager', () => {
    it('should initialize properly', () => {
        class Foo {};
        let manager = new Manager();
        expect(manager).to.be.an.instanceof(Manager);
        manager.contribute_to_class(Foo, 'dummy');
        expect(manager).to.have.property('model', Foo);
    });
});
