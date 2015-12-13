/* global beforeEach, describe, expect, it */
'use strict';

// just a small test that imports work
import { Model, Manager } from 'ponyjs/models.js';


describe('Shortcut imports', () => {
    it('should not error', () => {
        expect(Model).to.be.a('function');
        expect(Manager).to.be.a('function');
        expect(Manager.constructor).to.be.a('function');
    });
});
