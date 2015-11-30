'use strict';


import { ApiClient, defaultClient } from 'ponyjs/api/client.js';


class QuerySet {

    constructor (modelClass) {
        this.model = modelClass;
        this.filters = {};
        this.client = null;
    }

    __copy() {
        let copy = new this.constructor(this.model);
        copy.filters = this.filters;
        copy.client = this.client;
        return copy;
    }

    using(client) {
        this.client = client;
        return this; // chainable
    }

    _getList (params) {
        let endpoint = this.model._meta.endpoints.list;
        let _client;
        if (this.client) {
            _client = ApiClient.create(this.client);
        } else {
            _client = defaultClient;
        }
        return _client.get({}); // TODO...
    }

    all() {
        return this._getList();
    }

    filter(params) {
        for (let key in params) {
            if (this.filters[key] !== undefined) {
                console.warn(`overwriting filter '{$key}'`);
            }
            this.filter[key] = params[key];
        }
        return this._getList;
    }

}


export default QuerySet;
