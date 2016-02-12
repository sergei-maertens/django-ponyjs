import Cookies from 'js-cookie';

import { getClient } from 'ponyjs/api/client.js';


let generateResponse = function() {
    return [
        200,
        {'Content-type': 'application/json'},
        JSON.stringify({ok: true})
    ];
}


describe('the api client', () => {

    let server = null,
        client = null;

    before(() => {
        Cookies.set('csrftoken', 'dummy-csrf-token');
        client = getClient('default', force=true);

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

    after(() => {
        server.restore();
        Cookies.remove('csrftoken');
    });

    it('should not send the CSRF cookie as header with GET requests', () => {
        server.respondWith('GET', 'http://example.com/api/v1/dummy/', generateResponse());
        let request = client.createRequest('/dummy/').asGet().send();
        return request.should.eventually.satisfy(response => {
            let request = response.requestMessage;
            return !('X-CSRFToken' in request.headers.headers);
        });
    });

    it('should not send the CSRF cookie as header with HEAD requests', () => {
        server.respondWith('HEAD', 'http://example.com/api/v1/dummy/', generateResponse());
        let request = client.createRequest('/dummy/').asHead().send();
        return request.should.eventually.satisfy(response => {
            let request = response.requestMessage;
            return !('X-CSRFToken' in request.headers.headers);
        });
    });

    it('should not send the CSRF cookie as header with OPTIONS requests', () => {
        server.respondWith('OPTIONS', 'http://example.com/api/v1/dummy/', generateResponse());
        let request = client.createRequest('/dummy/').asOptions().send();
        return request.should.eventually.satisfy(response => {
            let request = response.requestMessage;
            return !('X-CSRFToken' in request.headers.headers);
        });
    });

    it('should send the CSRF cookie as header with POST requests', () => {
        server.respondWith('POST', 'http://example.com/api/v1/dummy/', generateResponse());
        let request = client.createRequest('/dummy/').asPost().send();
        return request.should.eventually.satisfy(response => {
            let request = response.requestMessage;
            let value = request.headers.headers['X-CSRFToken'];
            return value === 'dummy-csrf-token';
        });
    });

    it('should send the CSRF cookie as header with PUT requests', () => {
        server.respondWith('PUT', 'http://example.com/api/v1/dummy/', generateResponse());
        let request = client.createRequest('/dummy/').asPut().send();
        return request.should.eventually.satisfy(response => {
            let request = response.requestMessage;
            let value = request.headers.headers['X-CSRFToken'];
            return value === 'dummy-csrf-token';
        });
    });

    it('should send the CSRF cookie as header with DELETE requests', () => {
        server.respondWith('DELETE', 'http://example.com/api/v1/dummy/', generateResponse());
        let request = client.createRequest('/dummy/').asDelete().send();
        return request.should.eventually.satisfy(response => {
            let request = response.requestMessage;
            let value = request.headers.headers['X-CSRFToken'];
            return value === 'dummy-csrf-token';
        });
    });

});


describe('Api client', () => {

    let server = null,
        client = null;

    before(() => {
        Cookies.set('alternative-csrftoken', 'dummy-csrf-token-2');
        client = getClient('csrf');

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

    after(() => {
        server.restore();
        Cookies.remove('alternative-csrftoken');
    });

    it('should respect alternative csrf config', () => {
        server.respondWith('POST', 'http://example.com/api/v1/dummy/', generateResponse());
        let request = client.createRequest('/dummy/').asPost().send();
        return request.should.eventually.satisfy(response => {
            let request = response.requestMessage;
            let value = request.headers.headers['X-CSRF'];
            return value === 'dummy-csrf-token-2';
        });
    });

});
