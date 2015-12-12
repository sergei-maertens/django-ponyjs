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

  setDefaultEndpoints(endpoints={}) {
    let defaults = {
      list: `${this.model_name}/`,
      detail: `${this.model_name}/:id/`,
    };

    if (this.app_label) {
      for (let key in defaults) {
        defaults[key] = `${this.app_label}/${defaults[key]}`;
      }
    }

    this.endpoints = $.extend(true, defaults, endpoints);
  }

  // merge new endpoints with existing
  setEndpoints(endpoints) {
    this.endpoints = $.extend(true, this.endpoints, endpoints);
  }
}


class ModelState {
  constructor(instance, data) {
    this.instance = instance;
    this.original_values = $.extend(true, {}, data);
  }
}


Object.defineProperty(ModelState.prototype, 'dirty', {
  get: function() {
    let instance = this.instance;

    for (let fieldName in instance.constructor._meta.fields) {
      if ( this.original_values[fieldName] != instance[fieldName] ) {
        return true;
      }
    }
    return false;
  }
});


class ModelBase {
  constructor(data) {

    // set up the instance state
    this._state = new ModelState(this, data);

    // set the properties
    for (let key in data) {
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

  _equals(other) {
    for (let key in this) {
      if (key.startsWith('_')) {
        continue;
      }
      if (this[key] != other[key]) {
        return false;
      }
    }
    return true;
  }
}


Object.defineProperty(ModelBase, 'objects', {
  get: function() {
    if (!this._default_manager) {
      this._default_manager = new Manager(this);
    }
    return this._default_manager;
  }
});

Object.defineProperty(ModelBase, '_meta', {
  get: function() {
    if (!this.__meta) {
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
  };

  _Model._meta.fields = fields;
  _Model._meta.setDefaultEndpoints(meta.endpoints);

  for (name in managers) {
    _Model[name] = managers[name];
  }

  // also run contribute to class
  for (let key in attrs) {
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
