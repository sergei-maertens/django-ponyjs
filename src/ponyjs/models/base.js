'use strict';

import Manager from './manager';
import { Field } from './fields/fields';


class Options {
  constructor(opts) {
    // TODO: add some validation
    Object.assign(this, opts);
  }

  setDefaultEndpoints(endpoints={}) {
    let defaults = {
      list: `${this.model_name}/`,
      detail: `${this.model_name}/:id/`,
    };

    if (this.app_label) {
      for (let key of Object.keys(defaults)) {
        defaults[key] = `${this.app_label}/${defaults[key]}`;
      }
    }

    this.endpoints = Object.assign(defaults, endpoints);
  }

  // merge new endpoints with existing
  setEndpoints(endpoints) {
    this.endpoints = Object.assign(this.endpoints, endpoints);
  }
}


class ModelState {
  constructor(instance, data) {
    this.instance = instance;
    this.original_values = Object.assign({}, data);
  }

  get dirty() {
    let instance = this.instance;

    for (let fieldName of Object.keys(instance.constructor._meta.fields)) {
      if (this.original_values[fieldName] != instance[fieldName]) {
        return true;
      }
    }
    return false;

  }
}


class ModelBase {
  constructor(data) {

    // set up the instance state
    this._state = data;

    Object.assign(this, data);
  }

  static Meta() {
    return {
      app_label: null,
      name: this.name,
      ordering: ['id'],
      endpoints: {}
    };
  }

  _equals(other) {
    for (let key of Object.keys(this)) {
      if (this[key] != other[key]) {
        return false;
      }
    }
    return true;
  }

  static get _meta() {
    if (!this.__meta) {
      this.__meta = new Options(this.Meta());
    }
    return this.__meta;
  }

  static get objects() {
    if (!this._default_manager) {
      this._default_manager = new Manager();
      this._default_manager.model = this;
    }
    return this._default_manager;
  }

  // required in case the default manager is being overwritten
  static set objects(value) {
    this._default_manager = value;
  }

  get _state() {
    return this.__state;
  }

  set _state(data) {
    Object.defineProperty(this, '__state', {
      value: new ModelState(this, data),
      enumerable: false
    })
  }
}


// Factory to create models more declaritively-ish
let Model = function(name, attrs = {}) {
  let fields = {},
      meta = attrs.Meta || {},
      managers = {};

  meta.model_name = meta.model_name || name.toLowerCase();

  for (let key in attrs) {
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
  }

  _Model._meta.fields = fields;
  _Model._meta.setDefaultEndpoints(meta.endpoints);

  Object.assign(_Model, managers);

  // also run contribute to class
  for (let key in attrs) {
    let val = attrs[key];
    if (val.contribute_to_class) {
      val.contribute_to_class(_Model, key);
    }
  }

  // _Model.name = name; overridden by Babel
  return _Model;
};


export default Model;
export { Model, ModelBase, Options };
