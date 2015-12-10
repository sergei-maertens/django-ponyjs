'use strict';

import $ from 'jquery';

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
        this._result_cache = [];
    }

    __copy() {
        let copy = new this.constructor(this.model);
        copy.filters = $.extend(true, {}, this.filters);
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
        let request = this.client.createRequest(endpoint).asGet().withParams(params).send();
        return request.then(response => {
            let objs;
            if (typeof response.content == 'object') {
                let paginator = new Paginator(this.model);
                objs = paginator.paginated(response.content);
            } else {
                let rawObjects = response.content;
                objs = rawObjects.map(raw => new this.model(raw));
            }
            this._result_cache.concat(objs);
            return objs;
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
