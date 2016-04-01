/**
 * global sinon
 */

export let generateResponse = function(object, status=200) {
    return [
        status,
        {'Content-type': 'application/json'},
        JSON.stringify(object)
    ];
};


export let fakeServer = function() {
    let server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.xhr.useFilters = true;

    server.xhr.addFilter(function (method, uri) {
        let matched = uri.startsWith('http://example.com') || uri.startsWith('http://api.external.com');
        // Sinon FakeXHR filters need to return `false` if the request should be stubbed and
        // `true` if it should be allowed to pass through.
        return !matched;
    });
    return server;
}
