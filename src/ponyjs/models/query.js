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
            // it's a list, not an object containing pagination information
            if (Object.prototype.toString.call( response.content ) === '[object Array]') {
                let rawObjects = response.content;
                objs = rawObjects.map(raw => new this.model(raw));
            } else {
                let paginator = new Paginator(this.model);
                objs = paginator.paginated(response.content);
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
                // append, convert to list if necessary
                if (!Array.isArray(this.filters[key])) {
                    this.filters[key] = [this.filters[key]];
                }
                this.filters[key].push(params[key]);
            } else {
                this.filters[key] = params[key];
            }
        }
        return this.__copy();
    }

    // overridden to make calls chainable
    then(callback) {
        return this._getList(this.filters).then(callback);
    }

}


export default QuerySet;
