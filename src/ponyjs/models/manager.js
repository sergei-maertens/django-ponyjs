'use strict';

import QuerySet from './query.js';
// import Q from 'q';
// import Paginator from 'scripts/paginator';


class Manager {
  constructor(modelClass, using) {

    this.model = modelClass;
    this.using = using || null; // option to specify a different api client

  }

  all() {
    let qs = new QuerySet(this.model).using(this.using);
    return qs.all();
  }

  filter(params) {
    let qs = new QuerySet(this.model).using(this.using);
    return qs.filter(params);
  }

}

export default Manager;
