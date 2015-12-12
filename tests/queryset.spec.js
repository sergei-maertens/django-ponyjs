/* global beforeEach, describe, expect, it */
'use strict';

import { Model } from 'ponyjs/models/base';
import QuerySet from 'ponyjs/models/query';
import { IntegerField } from 'ponyjs/models/fields/fields';


let Pizza = Model('Pizza', {
    id: new IntegerField()
});


describe('Model Manager queries', () => {

    it('should return querysets', () => {
        let qs = Pizza.objects.all();
        expect(qs).to.be.an.instanceof(QuerySet);
    });

    it('should be chainable', () => {
        let qs = Pizza.objects.all();
        qs2 = qs.filter({foo: 'bar'});

        expect(qs2).to.be.an.instanceof(QuerySet);
        expect(qs2.filters).to.not.equal(qs.filters);
    });

});
