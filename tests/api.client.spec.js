/* global beforeEach, describe, expect, it */
'use strict';

import { getClient } from 'ponyjs/api/client.js';


describe('The API client interface', () => {

    it('should return the default client by default', () => {

        let client = getClient();
        expect(client.requestTransformers.length).to.equal(2); // baseurl + json

    });

});
