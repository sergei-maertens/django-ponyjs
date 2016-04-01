/* global beforeEach, describe, expect, it */
'use strict';

import { generateResponse, fakeServer } from './api.helper.js';

import { Model } from 'ponyjs/models/base.js';
import { NestedRelatedField, PrimaryKeyRelatedField, RelationDescriptor } from 'ponyjs/models/fields/related.js';


let Brand = Model('Brand');


describe('The base relation descriptor', () => {

    it('should throw on getter/setter access', () => {
        let descriptor = new RelationDescriptor(null, null);
        expect(() => descriptor.get(null)).to.throw(Error, 'Not implemented');
        expect(() => descriptor.set(null, null)).to.throw(Error, 'Not implemented');
    });

});


describe('Models with nested related fields', () => {

    let Kit = Model('Kit', {
        brand: new NestedRelatedField(Brand)
    });

    it('should return null if the nested data is not present', () => {
        let kit = new Kit({id: 1});
        let kit2 = new Kit({id: 2, brand: null});
        expect(kit.brand).to.be.null;
        // check that second access returns the same instance
        let brand = kit.brand;
        expect(kit.brand).to.equal(brand);
        expect(kit2.brand).to.be.null;
    });

    it('should instantiate nested foreign keys', () => {
        let kit = new Kit({
            id: 1,
            brand: {
                id: 2
            }
        });
        return kit.brand.should.eventually
            .be.instanceOf(Brand)
            and.deep.equal({id: 2});
    });

});


describe.only('Models with pk related fields', () => {

    let server = null;

    let Kit = Model('Kit', {
        brand: new PrimaryKeyRelatedField(Brand)
    });

    beforeEach(() => {
        server = fakeServer();
    });

    afterEach(() => {
        server.restore();
    });

    it('should instantiate nested foreign keys', () => {
        let kit = new Kit({brand: 1});
        let okResponse = generateResponse({id: 1, name: 'pony'});
        server.respondWith('GET', 'http://example.com/api/v1/brand/1/', okResponse);
        expect(kit.brand).to.be.instanceOf(Brand);
        expect(kit.brand).to.deep.equal({id: 1, name: 'pony'});
    });

});
