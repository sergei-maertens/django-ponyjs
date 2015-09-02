'use strict';

import $ from 'jquery';


class Field {
    constructor (name, options) {
        this.type = null;
        this.verbose_name = name;
        let defaults = this.constructor.defaults();
        options = $.extend(true, defaults, options || {});
        for (let key in defaults) {
            this[key] = options[key];
        }
    }

    static defaults () {
        return {
            blank: false
        }
    }
}


class StringField extends Field {
    static defaults () {
        let defaults = super.defaults();
        return $.extend(true, defaults, {
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
