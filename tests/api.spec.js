/* global beforeEach, describe, expect, it */
'use strict';

import { Model } from 'ponyjs/models/base';
import QuerySet from 'ponyjs/models/query';
import { IntegerField } from 'ponyjs/models/fields/fields';


let Pizza = Model('Pizza', {
    id: new IntegerField()
});


describe('Model Manager queries', () => {

    it('should return QuerySet instances', () => {
        // if it has a 'then' method, it's a promise
        let qs = Pizza.objects.all();
        console.log(qs);
        expect(qs).to.be.an.instanceof(QuerySet);
    });

    it('should provide a promise API', () => {
        let qs = Pizza.objects.all();
        let promise = qs.then(() => {});
        expect(promise.then).to.be.a('function');
    });

});
