'use strict';

import { ApiClient } from 'api-client';


/**
 * Rest API client that backs the model manager methods.
 * Uses NodeJS api-client library.
 */

// provide this base config with node-config
// https://github.com/lorenwest/node-config
let config = {
    endpoints: {
        default: {
            type: 'VersionedApiClient', // default
            host: 'localhost',
            port: 8000,
            options: {
                protocol: 'http',
                base_path: '/api',
                version: 'v1',
                username: null, // for http basic auth
                password: null,
            }
        }
    }
};


ApiClient.load(config);
let defaultClient = ApiClient.create('default');


export default ApiClient;
export { ApiClient, defaultClient };
