'use strict';

import QuerySet from './query.js';


class Manager {
  constructor(modelClass, using) {

    this.model = modelClass;
    this._using = using || null; // option to specify a different api client

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
