'use strict';

import QuerySet from './query.js';


class Manager {
  constructor(using) {
    this.model = null;
    this._using = using || null; // option to specify a different api client
  }

  contribute_to_class(modelClass, key) {
    this.model = modelClass;
  }

  using(alias=null) {
    return new QuerySet(this.model).using(alias);
  }

  all() {
    let qs = new QuerySet(this.model).using(this._using);
    return qs.all();
  }

  filter(params) {
    let qs = new QuerySet(this.model).using(this._using);
    return qs.filter(params);
  }

}

export default Manager;
export { Manager };
