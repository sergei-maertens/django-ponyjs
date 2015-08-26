'use strict';


// import Q from 'q';
// import Api from 'scripts/api';
// import Paginator from 'scripts/paginator';


class Manager {
  constructor(modelClass) {
    this.model = modelClass;
    this._objectCache = {
      _pages: {},
      _objects: {}
    };
  }

  // _createObjs(raw_objects) {
  //   var objs = raw_objects.map(
  //     props => {
  //       let obj = new this.model(props);
  //       this._objectCache._objects[obj.id] = obj;
  //       return obj;
  //     }
  //   );
  //   return objs;
  // }

  // all() {
  //   var self = this;
  //   var endpoint = self.model._meta.endpoints.list;

  //   return Api.request(endpoint).get().then(function(response) {
  //     var hasPagination = 'count' in response;
  //     if (hasPagination) {
  //       debugger; // TODO
  //     } else { // response is a list of objects, so instatiate
  //       return self._createObjs(response);
  //     }
  //   });
  // }

  // filter(filters, force_refresh) {
  //   // TODO: block until promise is resolved and return the result immediately?
  //   var endpoint = this.model._meta.endpoints.list;
  //   var self = this;
  //   var key = JSON.stringify(filters);
  //   var cached = self._objectCache[key];
  //   if (cached !== undefined && !force_refresh) {
  //     let deferred = Q.defer();
  //     deferred.resolve(cached);
  //     return deferred.promise;
  //   }
  //   return Api.request(endpoint, filters).get().then(function(response) {
  //     var paginator = new Paginator();
  //     paginator.paginate(response, filters.page);
  //     var objects = self._createObjs(response.results);
  //     objects.page_obj = paginator;
  //     self._objectCache[key] = objects; // cache the result
  //     return objects;
  //   });
  // }

  // get(filters) {
  //   var self = this;
  //   var endpoint = self.model._meta.endpoints.detail;
  //   if ('id' in filters) {
  //     // first check the local object cache
  //     var _obj = self._objectCache._objects[filters.id];
  //     if (_obj !== undefined) {
  //       var deferred = Q.defer();
  //       deferred.resolve(_obj);
  //       return deferred.promise;
  //     }
  //     endpoint = endpoint.replace(':id', filters.id);
  //     delete filters.id;
  //   }
  //   return Api.request(endpoint, filters).get()
  //             .then( response => this._createObjs( [response] )[0] );
  // }

}

export default Manager;
