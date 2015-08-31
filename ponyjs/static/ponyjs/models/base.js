'use strict';

import $ from 'jquery';
import Manager from './manager';


class Options {
  constructor(opts) {
    // TODO: add some validation
    for (var key in opts) {
      this[key] = opts[key];
    }
  }

  // merge new endpoints with existing
  setEndpoints(endpoints) {
    this.endpoints = $.extend(true, this.endpoints, endpoints);
  }
}


class Model {
  constructor(data) {

    // set the properties
    for (var key in data) {
      this[key] = data[key];
    }
  }

  static Meta() {
    return {
      app_label: null,
      name: this.name,
      ordering: ['id'],
      endpoints: {}
    };
  }
}


Object.defineProperty(Model, 'objects', {
  get: function() {
    if (!this._default_manager) {
      console.debug('Initializing default mananager for model `' + this.name + '`');
      this._default_manager = new Manager(this);
    }
    return this._default_manager;
  }
});

Object.defineProperty(Model, '_meta', {
  get: function() {
    if (!this.__meta) {
      console.debug('Initializing meta options for model `' + this.name + '`');
      this.__meta = new Options(this.Meta());
    }
    return this.__meta;
  }
});


export default Model;
export { Options };
