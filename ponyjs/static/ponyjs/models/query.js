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

    using(alias) {
        this.client = getClient(alias);
        return this; // chainable
    }

    _getList (params) {
        let endpoint = this.model._meta.endpoints.list;
        return this.client.get(endpoint).then(response => {
            debugger;
        }); // TODO...
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
