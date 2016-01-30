'use strict';

import url from 'url';

import { HttpClient as _HttpClient } from 'aurelia-http-client';
import { initialize } from 'aurelia-pal-browser';
import Cookies from 'js-cookie';

import apiConf from 'conf/api.json!';

import addCsrfToken from './csrf.js';


initialize();

let clientPool = {};

const supportedTokens = [
    'version',
];

/**
 * Custom subclass to always add the CSRF check before sending a potentially
 * data-altering request.
 */
class HttpClient extends _HttpClient {
    send(requestMessage, transformers) {
        if (transformers.length) {
            transformers.push(addCsrfToken);
        }
        return super.send(requestMessage, transformers);
    }
}


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
    let basePath = localConf.basePath || '/';

    if (localConf.options) {
        for (let i=0; i<supportedTokens.length; i++) {
            let token = supportedTokens[i];
            if (localConf.options[token] !== undefined) {
                basePath = basePath.replace(`[${token}]`, localConf.options[token]);
            }
        }
    }

    baseUrl = url.resolve(baseUrl, basePath);
    let client = new HttpClient().configure(x => {
        x.withBaseUrl(baseUrl);
        x.withHeader('Content-Type', 'application/json');
    });

    let csrfHeader = localConf.csrfHeader ? localConf.csrfHeader : 'X-CSRFToken';
    let csrfToken = Cookies.get(localConf.csrfCookie ? localConf.csrfCookie : 'csrftoken');

    client._csrf = {
        key: csrfHeader,
        value: csrfToken
    };

    clientPool[alias] = client;
    return client;
}


let getClient = function(alias) {
    return clientPool[alias] || clientFactory(alias);
}


let defaultClient = getClient('default');


export default defaultClient;
export { defaultClient, getClient };
