/* global beforeEach, describe, expect, it */
'use strict';

import { Model } from 'ponyjs/models/base';
import { IntegerField } from 'ponyjs/models/fields/fields';

let Pizza = Model('Pizza', {
    id: new IntegerField()
});


describe('Model Manager queries', () => {

    it('should make rest api calls that return promises', () => {
        let promise = Pizza.objects.all();
        expect(promise).to.be.an.instanceof(Promise);
        return promise.
    });

    it('should return instances', () => {
        let promise = Pizza.objects.all();

        let spy = sinon.stub(promise).returns(Promise.resolve(
            ))

    });

});
