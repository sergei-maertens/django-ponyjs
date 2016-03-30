'use strict';

import { Field } from './fields.js';


class ForeignKey extends Field {

    /**
     * @param to: Model Class this relates to
     */
    constructor(to, name, options) {
        super(name, options);
        this.to = to;
    }

    /**
     * Set up the descriptor
     */
    contribute_to_class (cls, name) {
        super.contribute_to_class(cls, name);

        let field = this;

        // make sure assignment instantiates an instance of the related model
        Object.defineProperty(cls.prototype, name, {
            get: function() {
                let raw = this[`_${name}_raw`];
                let instance = this[`_${name}_cached`];
                if (instance) {
                    return instance;
                }
                instance = raw ? new field.to(raw) : null
                if (instance) {
                    this[`_${name}_cached`] = instance;
                }
                return instance;
            },

            set: function(data) {
                this[`_${name}_raw`] = data;
            }
        });
    }
}


export { ForeignKey };
