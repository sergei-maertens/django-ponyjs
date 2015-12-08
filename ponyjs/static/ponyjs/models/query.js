'use strict';


import { defaultClient, getClient } from '../api/client.js';
import Paginator from './paginator.js';


class QuerySet {
    /**
     * Idea to make filter(...) calls chainable: return the `this` object,
     * and override QuerySet.then to trigger evaluation at that point
     */

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
        let request = this.client.get(endpoint, params);
        return request.then(response => {
            if (typeof response.content == 'object') {
                let paginator = new Paginator(this.model);
                let objs = paginator.paginated(response.content);
                return objs;
            } else {
                let rawObjects = response.content;
                let objs = rawObjects.map(raw => new this.model(raw));
                return objs;
            }
        });
    }

    all() {
        return this.__copy();
    }

    /* TODO: chainable */
    filter(params) {
        for (let key in params) {
            if (this.filters[key] !== undefined) {
                console.warn(`overwriting filter '{$key}'`);
            }
            this.filters[key] = params[key];
        }
        return this.__copy();
    }

    // overridden to make calls chainable
    then(callback) {
        return this._getList(this.filters).then(callback);
    }

}


export default QuerySet;
