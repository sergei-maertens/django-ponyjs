'use strict';

import { Field } from './fields.js';


/**
 * Base relation descriptor that handles the complex stuff with setting the
 * correct properties. This should be implemented with proxies as soon as they're
 * natively available (in the browser or Babel/Traceur)
 */
class RelationDescriptor {
    constructor(field, name) {
        this.field = field;
        this.name = name;
    }

    as_descriptor() {
        return {
            get: this.getter,
            set: this.setter
        };
    }

    get getter() {
        let descriptor = this;
        // scope changes for descriptors, use a closure
        return function() {
            return descriptor.get.call(descriptor, this);
        }
    };


    get setter() {
        let descriptor = this;
        // scope changes for descriptors, use a closure
        return function(value) {
            // this points to the model instance
            return descriptor.set.call(descriptor, this, value);
        };
    };

    get(instance) {
        throw new Error('Not implemented');
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
        let nestedInstance = instance[`_${name}_cached`];
        if (nestedInstance) {
            return nestedInstance;
        }
        nestedInstance = raw ? new this.field.to(raw) : null;
        if (nestedInstance) {
            instance[`_${name}_cached`] = nestedInstance;
        }
        return nestedInstance;
    }

    /**
     * Set the raw nested relation data
     * @param data: Object
     */
    set(instance, data) {
        instance[`_${this.name}_raw`] = data;
    }
}


class RelatedField extends Field {

    /**
     * @param to: Model Class this relates to
     */
    constructor(to, name, options) {
        super(name, options);
        this.to = to;
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


class NestedRelatedField extends RelatedField {
    constructor(...args) {
        super(...args);
        this.descriptor = NestedRelationDescriptor;
    }
}


export { NestedRelatedField };
