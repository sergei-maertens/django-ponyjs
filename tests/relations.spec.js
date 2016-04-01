/* global beforeEach, describe, expect, it */
'use strict';

import { generateResponse, fakeServer } from './api.helper.js';

import { Model, NestedRelatedField, PrimaryKeyRelatedField } from 'ponyjs/models.js';
import { RelationDescriptor } from 'ponyjs/models/fields/related.js';


let Brand = Model('Brand');


describe('The base relation descriptor', () => {

    it('should throw on getter/setter access', () => {
        let descriptor = new RelationDescriptor(null, null);
        expect(() => descriptor.set(null, null)).to.throw(Error, 'Not implemented');
        return expect(descriptor.get(null)).to.eventually.be.rejectedWith(Error, 'Not implemented');
    });

});


describe('Models with nested related fields', () => {

    let Kit = Model('Kit', {
        brand: new NestedRelatedField(Brand)
    });

    it('should return null if the nested data is not present', () => {
        let kit = new Kit({id: 1});
        let kit2 = new Kit({id: 2, brand: null});
        return Promise.all([
            kit.brand.should.eventually.be.null,
            kit2.brand.should.eventually.be.null
        ]);
    });

    it('should instantiate nested foreign keys', () => {
        let kit = new Kit({
            id: 1,
            brand: {
                id: 2
            }
        });
        return kit.brand.should.eventually.be.instanceOf(Brand)
            .and.deep.equal({id: 2});
    });

    it('should return the cached instance', () => {
        let kit = new Kit({brand: {id: 1}});
        let brand;
        return kit.brand.then(_brand => {
            brand = _brand;
            return kit.brand;
        }).then(_brand2 => {
            expect(_brand2).to.not.be.null;
            expect(_brand2).to.be.equal(brand);
        });
    });

});


describe('Models with pk related fields', () => {

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

    it('should resolve to null if the pk is not present', () => {
        let kit = new Kit({brand: null});
        let kit2 = new Kit();
        return Promise.all([
            kit.brand.should.eventually.be.null,
            kit2.brand.should.eventually.be.null
        ]);
    });

    it('should instantiate nested foreign keys', () => {
        let kit = new Kit({brand: 1});
        let okResponse = generateResponse({id: 1, name: 'pony'});
        server.respondWith('GET', 'http://example.com/api/v1/brand/1/', okResponse);
        return kit.brand.should.eventually
            .be.instanceOf(Brand)
            .and.deep.equal({id: 1, name: 'pony'});
    });

    it('should cache the retrieved object', () => {
        let kit = new Kit({brand: 1});
        let okResponse = generateResponse({id: 1, name: 'pony'});
        server.respondWith('GET', 'http://example.com/api/v1/brand/1/', okResponse);
        let brand1, brand2;

        return kit.brand.then(_brand => {
            brand1 = _brand;
            return kit.brand;
        }).then(_brand => {
            brand2 = _brand;
        }).should.eventually.satisfy(() => {
            return brand1 === brand2;
        });
    });

});
