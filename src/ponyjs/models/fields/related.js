'use strict';

import { Field } from './fields.js';


/**
 * Base relation descriptor that handles the complex stuff with setting the
 * correct properties. This should be implemented with proxies as soon as they're
 * natively available (in the browser or Babel/Traceur)
 */
export class RelationDescriptor {
    constructor(field, name) {
        this.field = field;
        this.name = name;
    }

    as_descriptor() {
        let descriptor = this;
        return {
            get: function() { // not an arrow function because we need the proper scope
                return descriptor.get.call(descriptor, this);
            },
            set: function(value) {
                // this points to the model instance
                return descriptor.set.call(descriptor, this, value);
            },
        };
    }

    get_cache_name() {
        return `_${this.name}_cache`;
    }

    get(instance) {
        return Promise.reject(new Error('Not implemented'));
    }

    set(instance, value) {
        throw new Error('Not implemented');
    }
}


/**
 * Takes a nested object for a 'root' object and instantiates the related
 * model instance.
 */
class NestedRelationDescriptor extends RelationDescriptor {
    get(instance) {
        let name = this.name;
        let raw = instance[`_${name}_raw`];
        let cache_name = this.get_cache_name();
        let nestedInstance = instance[cache_name];
        if (nestedInstance !== undefined) {
            return Promise.resolve(nestedInstance);
        }
        nestedInstance = raw ? new this.field.to(raw) : null;
        if (nestedInstance) {
            instance[cache_name] = nestedInstance;
        }
        return Promise.resolve(nestedInstance);
    }

    /**
     * Set the raw nested relation data
     * @param data: Object
     */
    set(instance, data) {
        instance[`_${this.name}_raw`] = data;
    }
}


class PrimaryKeyRelationDescriptor extends RelationDescriptor {
    get(instance) {
        let cache_name = this.get_cache_name();
        if (instance[cache_name] !== undefined) {
            return Promise.resolve(instance[cache_name]);
        }
        let pk = instance[`${this.name}_id`];
        if (pk === undefined || pk === null) {
            return Promise.resolve(null);
        }
        // do the lookup
        let model = this.field.to;
        // TODO: getter for _default_manager
        return model.objects.get({id: pk}).then(obj => {
            instance[cache_name] = obj;
            return obj;
        });
    }

    /**
     * Store the pk on the instance, similar to Django ForeignKey.
     * @param id: primary key value
     */
    set(instance, id) {
        instance[`${this.name}_id`] = id;
    }
}


/**
 * Base class for related fields. This should never be instantiated
 * directly.
 */
class RelatedField extends Field {

    /**
     * @param to: Model Class this relates to
     */
    constructor(to, name, options) {
        super(name, options);
        this.to = to; // might have to be abstracted in a ForeignObjectRel object or similar
        this.descriptor = null; // set up the type of descriptor used
    }

    /**
     * Set up the descriptor
     */
    contribute_to_class (cls, name) {
        super.contribute_to_class(cls, name);

        // make sure assignment instantiates an instance of the related model
        // through the configured descriptor
        let descriptor = new this.descriptor(this, name);
        Object.defineProperty(cls.prototype, name, descriptor.as_descriptor());
    }
}


/**
 * Related field that deals with nested objects through the correct descriptor.
 */
export class NestedRelatedField extends RelatedField {
    constructor(...args) {
        super(...args);
        this.descriptor = NestedRelationDescriptor;
    }
}


export class PrimaryKeyRelatedField extends RelatedField {
    constructor(...args) {
        super(...args);
        this.descriptor = PrimaryKeyRelationDescriptor;
    }
}
