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
        expect(qs).to.be.an.instanceof(QuerySet);
    });

    it('should provide a promise API', () => {
        let qs = Pizza.objects.all();
        expect(qs.then).to.be.a('function');
    });

});


describe('QuerySets', () => {

    let server = null;

    beforeEach(() => {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.xhr.useFilters = true;

        server.xhr.addFilter(function (method, uri) {
            let matched = uri.startsWith('http://example.com');
            // Sinon FakeXHR filters need to return `false` if the request should be stubbed and
            // `true` if it should be allowed to pass through.
            return !matched;
        });
    });

    afterEach(() => {
        server.restore();
    });


    it('should make api calls', (done) => {
        let pizza = new Pizza({'id': 1});
        var okResponse = [
            200,
            { 'Content-type': 'application/json' },
            '[{"id":1}]'
        ];
        server.respondWith('GET', 'http://example.com/api/v1/pizza/', okResponse);
        return Pizza.objects.all().should
            .eventually.be.an.instanceof(Array)
            .and.satisfy((objList) => {
                return (objList.length == 1 && pizza._equals(objList[0]));
            })
            .notify(done);
    });

})
