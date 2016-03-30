/* global beforeEach, describe, expect, it */
'use strict';

import { Model } from 'ponyjs/models/base';


let Kit = Model('Kit');
let Brand = Model('Brand');


let generateResponse = function(object, status=200) {
    return [
        status,
        {'Content-type': 'application/json'},
        JSON.stringify(object)
    ];
}


describe('Models with relation fields', () => {

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

    it('should resolve nested foreign keys', () => {
        var okResponse = generateResponse({
            "id": 1,
            "name": "S100 & Flak 38 Schnellboot",
            "kit_number": "",
            "box_image": {
                "small": null
            },
            "brand": {
                "id": 2,
                "name": "Revell",
                "is_active": true,
                "logo": {
                    "small": "http://example.com/media/image.jpg"
                }
            }
        });
        server.respondWith('GET', 'http://example.com/api/v1/kit/1/', okResponse);
        let expectedBrand = new Brand({"id": 2,
            "name": "Revell",
            "is_active": true,
            "logo": {
                "small": "http://example.com/media/image.jpg"
            }
        });
        return Kit.objects.get({id: 1}).should
            .eventually.be.an.instanceof(Kit)
            .and.satisfy(kit => {
                return (kit.brand instanceof Brand);
            }).and.satisfy(kit => {
                return kit.brand._equals(expectedBrand);
            });
    });
});
