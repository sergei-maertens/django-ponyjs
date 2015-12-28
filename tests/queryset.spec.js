/* global beforeEach, describe, expect, it */
'use strict';

import { Model } from 'ponyjs/models/base';
import QuerySet from 'ponyjs/models/query';
import { IntegerField } from 'ponyjs/models/fields/fields';
import { defaultClient } from 'ponyjs/api/client.js';


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
        let qs2 = qs.filter({foo: 'bar'});
        let qs3 = qs2.filter({foo2: 'baz'});

        expect(qs2).to.be.an.instanceof(QuerySet);
        expect(qs2.filters).to.not.equal(qs.filters);
        expect(qs3.filters).to.deep.equal({
            foo: 'bar',
            foo2: 'baz'
        });
    });

    it('should not overwrite existing keys, but append', () => {
        let qs = Pizza.objects.filter({foo: 'bar'}).filter({foo: 'baz'});
        expect(qs.filters).to.deep.equal({
            foo: ['bar', 'baz']
        });
    });

    it('should not overwrite existing keys, but append, even if it\'s already an array', () => {
        let qs = Pizza.objects.filter({foo: ['bar', 'baz']});
        qs.filter({foo: 'baw'});
        expect(qs.filters).to.deep.equal({
            foo: ['bar', 'baz', 'baw']
        });
    });

});


describe('Queryset.get', () => {

    it('should return a promise', () => {
        // no params, falls back to list
        let promise = Pizza.objects.all().get();
        expect(promise).to.be.instanceof(Promise);
        // we expect a 404 here because the server isn't running
        return promise.should.eventually.throw;
    });


    it('should return a promise (2)', () => {
        let promise = Pizza.objects.all().get({id: 1});
        expect(promise).to.be.instanceof(Promise);
        // we expect a 404 here because the server isn't running
        return promise.should.eventually.throw;
    });

});


describe('Querysets', () => {

    it('should default to the default client', () => {
        let qs = new QuerySet(Pizza).using();
        expect(qs.client).to.equal(defaultClient);
    });

});
