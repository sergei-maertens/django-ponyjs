/* global beforeEach, describe, expect, it */
'use strict';

import { Model } from 'ponyjs/models/base';
import { Manager } from 'ponyjs/models/manager';
import { DoesNotExist, MultipleObjectsReturned, QuerySet} from 'ponyjs/models/query';
import { IntegerField } from 'ponyjs/models/fields/fields';


let Pizza = Model('Pizza', {
    id: new IntegerField()
});


let generateResponse = function(object) {
    return [
        200,
        {'Content-type': 'application/json'},
        JSON.stringify(object)
    ];
}


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

    it('should throw for undefined API aliases', () => {
        expect(
            () => Pizza.objects.using('i-do-definitely-not-exist').all()
        ).to.throw('Alias i-do-definitely-not-exist is missing in conf/api.json');
    });
});


describe('QuerySets that return lists', () => {

    let server = null;

    beforeEach(() => {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.xhr.useFilters = true;

        server.xhr.addFilter(function (method, uri) {
            let matched = uri.startsWith('http://example.com') || uri.startsWith('http://api.external.com');
            // Sinon FakeXHR filters need to return `false` if the request should be stubbed and
            // `true` if it should be allowed to pass through.
            return !matched;
        });
    });

    afterEach(() => {
        server.restore();
    });

    it('should make api calls', () => {
        let pizza = new Pizza({'id': 1});
        var okResponse = generateResponse([{id: 1}]);
        server.respondWith('GET', 'http://example.com/api/v1/pizza/', okResponse);
        return Pizza.objects.all().should
            .eventually.be.an.instanceof(Array)
            .and.satisfy(objList => {
                return (objList.length == 1 && pizza._equals(objList[0]));
            });
    });

    it('should construct proper querystrings', () => {
        let pizza = new Pizza({'id': 6});
        let qs = Pizza.objects.filter({id__lte: 10, id__gte: 5});
        var okResponse = generateResponse([{id: 6}]);
        server.respondWith('GET', 'http://example.com/api/v1/pizza/?id__gte=5&id__lte=10', okResponse);
        return qs.should.eventually.satisfy(objList => {
            return (objList.length ==1 && pizza._equals(objList[0]));
        });
    });

    it('should be possible to select a different API', () => {
        let qs = Pizza.objects.using('simple');
        server.respondWith('GET', 'http://api.external.com/pizza/', generateResponse([]));
        return qs.should.eventually.deep.equal([]);
    });

    it('should be possible to select a different API on model definition', () => {
        let Pizza2 = Model('Pizza2', {
            id: new IntegerField(),
            objects: new Manager('external'),
        });
        expect(Pizza2.objects._using).to.equal('external');
        let qs = Pizza2.objects.all();
        server.respondWith('GET', 'http://api.external.com/pizza2/', generateResponse([]));
        return qs.should.eventually.deep.equal([]);
    });

    it('should paginate responses automatically', () => {
        let qs = Pizza.objects.all();
        server.respondWith('GET', 'http://example.com/api/v1/pizza/', generateResponse({
            paginate_by: 2,
            results: [{id: 1}, {id: 2}],
            count: 3
        }));
        let [pizza1, pizza2] = [ new Pizza({id: 1}), new Pizza({id: 2}) ];
        return qs.should.eventually.satisfy(objList => {
                return objList.length == 2 &&
                       pizza1._equals(objList[0]) &&
                       pizza2._equals(objList[1])
                ;
            }).and.have.property('paginator');
    });

});


describe('QuerySets that return details', () => {

    let server = null;

    beforeEach(() => {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.xhr.useFilters = true;

        server.xhr.addFilter(function (method, uri) {
            let matched = uri.startsWith('http://example.com') || uri.startsWith('http://api.external.com');
            // Sinon FakeXHR filters need to return `false` if the request should be stubbed and
            // `true` if it should be allowed to pass through.
            return !matched;
        });
    });

    afterEach(() => {
        server.restore();
    });

    it('should fetch details from lists', () => {
        let pizza = new Pizza({'id': 1});
        var okResponse = generateResponse([{id: 1}]);
        let qs = Pizza.objects.filter({id: 1});
        server.respondWith('GET', 'http://example.com/api/v1/pizza/?id=1', okResponse);
        return qs.get().should.eventually.satisfy(obj => pizza._equals(obj));
    });

    it('should throw if multiple objects are returned', () => {
        var okResponse = generateResponse([{id: 1}, {id: 2}]);
        let qs = Pizza.objects.all();
        server.respondWith('GET', 'http://example.com/api/v1/pizza/', okResponse);
        return qs.get().should.be.rejectedWith(MultipleObjectsReturned);//, 'Found 2 objects, expected 1.');
    });

    it('should throw if no objects are returned', () => {
        var okResponse = generateResponse([]);
        let qs = Pizza.objects.all();
        server.respondWith('GET', 'http://example.com/api/v1/pizza/', okResponse);
        return qs.get().should.be.rejectedWith(DoesNotExist);
    });

    it('should fetch details from get with params', () => {
        let _pizza = {'id': 1, name: 'pepperoni'};
        let pizza = new Pizza(_pizza);
        var okResponse = generateResponse(_pizza);
        server.respondWith('GET', 'http://example.com/api/v1/pizza/1/', okResponse);
        return Pizza.objects.get({id: 1}).should.eventually.satisfy(obj => pizza._equals(obj));
    });

    it('should fetch details from get with params and querystrings', () => {
        let _pizza = {'id': 1, name: 'pepperoni'};
        let pizza = new Pizza(_pizza);
        var okResponse = generateResponse(_pizza);
        server.respondWith('GET', 'http://example.com/api/v1/pizza/1/?foo=bar', okResponse);
        return Pizza.objects.get({id: 1, foo: 'bar'}).should.eventually.satisfy(obj => pizza._equals(obj));
    });
});
