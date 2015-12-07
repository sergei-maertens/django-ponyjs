'use strict';


import { defaultClient, getClient } from '../api/client.js';


class QuerySet {

    constructor (modelClass) {
        this.model = modelClass;
        this.filters = {};
        this.client = defaultClient;
    }

    __copy() {
        let copy = new this.constructor(this.model);
        copy.filters = this.filters;
        copy.client = this.client;
        return copy;
    }

    using(alias=null) {
        if (alias !== null) {
            this.client = getClient(alias);
        }
        return this; // chainable
    }

    _getList (params) {
        let endpoint = this.model._meta.endpoints.list;
        let request = this.client.get(endpoint);
        return request.then(response => {
            let rawObjects = response.content;
            let objs = rawObjects.map(raw => new this.model(raw));
            return objs;
        });
    }

    all() {
        return this._getList();
    }

    filter(params) {
        for (let key in params) {
            if (this.filters[key] !== undefined) {
                console.warn(`overwriting filter '{$key}'`);
            }
            this.filters[key] = params[key];
        }
        return this._getList(this.filters);
    }

}


export default QuerySet;
