'use strict';

import url from 'url';

import { HttpClient } from 'aurelia-http-client';

import apiConf from 'conf/api.json!';


let clientPool = {};

let supportedTokens = [
    'version',
];

/**
 * Factory that takes a key from apiConf and applies that endpoint
 * configuration.
 */
let clientFactory = function(alias='default') {
    let localConf = apiConf[alias];
    if (localConf === undefined) {
        throw new Error(`Alias ${alias} is missing in conf/api.json`);
    }

    let baseUrl = localConf.baseUrl;
    let basePath = localConf.basePath;

    for (let i=0; i<supportedTokens.length; i++) {
        let token = supportedTokens[i];
        if (localConf.options[token] !== undefined) {
            basePath = basePath.replace(`[${token}]`, localConf.options[token]);
        }
    }

    baseUrl = url.resolve(baseUrl, basePath);
    let client = new HttpClient().configure(x => {
        x.withBaseUrl(baseUrl);
        x.withHeader('Content-Type', 'application/json');
    });

    clientPool[alias] = client;
    return client;
}


let getClient = function(alias) {
    return clientPool[alias] || clientFactory(alias);
}


let defaultClient = getClient('default');


export default defaultClient;
export { defaultClient, getClient };
