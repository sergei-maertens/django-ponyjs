/* global beforeEach, describe, expect, it */
'use strict';

import { Model } from 'ponyjs/models/base.js';
import { NestedRelatedField, RelationDescriptor } from 'ponyjs/models/fields/related.js';


let Brand = Model('Brand');
let Kit = Model('Kit', {
    brand: new NestedRelatedField(Brand)
});


describe('The base relation descriptor', () => {

    it('should throw on getter/setter access', () => {
        let descriptor = new RelationDescriptor(null, null);
        expect(() => descriptor.get(null)).to.throw(Error, 'Not implemented');
        expect(() => descriptor.set(null, null)).to.throw(Error, 'Not implemented');
    });

});


describe('Models with relation fields', () => {

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
        expect(kit.brand).to.be.instanceOf(Brand);
        expect(kit.brand).to.deep.equal({id: 2});
    });

});
