'use strict';

class Field {
    constructor (name, options={}) {
        this.type = null;
        this.model = null;
        this.verbose_name = name;
        let defaults = this.constructor.defaults();
        Object.assign(this, defaults, options);
    }

    static defaults () {
        return {
            blank: false
        }
    }

    contribute_to_class (cls, name) {
        this.model = cls;
        this.name = name;
    }
}


class StringField extends Field {
    static defaults () {
        let defaults = super.defaults();
        return Object.assign(defaults, {
            max_length: null
        });
    }
}

StringField.type = String;


class IntegerField extends Field {}
IntegerField.type = parseInt;


class FloatField extends Field {}
FloatField.type = parseFloat;



export { Field, StringField, IntegerField, FloatField };
export default Field;
