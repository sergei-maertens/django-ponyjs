'use strict';

import $ from 'jquery';
import Manager from './manager';
import { Field } from './fields/fields';


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


class ModelBase {
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


Object.defineProperty(ModelBase, 'objects', {
  get: function() {
    if (!this._default_manager) {
      console.debug('Initializing default mananager for model `' + this.name + '`');
      this._default_manager = new Manager(this);
    }
    return this._default_manager;
  }
});

Object.defineProperty(ModelBase, '_meta', {
  get: function() {
    if (!this.__meta) {
      console.debug('Initializing meta options for model `' + this.name + '`');
      this.__meta = new Options(this.Meta());
    }
    return this.__meta;
  }
});


// Factory to create models more declaritively-ish
let Model = function(name, attrs) {
  let fields = {},
      meta = attrs.Meta || {},
      managers = {};

  meta.model_name = meta.model_name || name.toLowerCase();

  for (key in attrs) {
    let val = attrs[key];
    if (val instanceof Field) {
      fields[key] = val;
    } else if (val instanceof Manager) {
      managers[key] = val;
    }
  }

  class _Model extends ModelBase {
    static Meta() {
      return meta;
    }
  };

  _Model._meta.fields = fields;

  for (name in managers) {
    _Model[name] = managers[name];
  }

  // also run contribute to class
  for (key in attrs) {
    let val = attrs[key];
    if (val.contribute_to_class) {
      val.contribute_to_class(_Model, key);
    }
  }

  // _Model.name = name; overriden by Babel
  return _Model;
};


export default Model;
export { Model, ModelBase, Options };
