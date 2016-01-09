'use strict';

import $ from 'jquery';


export default class Formset {
    constructor (prefix) {
        this.prefix = prefix;
        this.id_regex = new RegExp(`(${prefix}-(\\d+|__prefix__))`, 'g');
    }

    _getTotalFormsInput() {
        return $(`#id_${this.prefix}-TOTAL_FORMS`);
    }

    get totalForms() {
        return parseInt(this._getTotalFormsInput().val(), 10);
    }

    set totalForms(num) {
        this._getTotalFormsInput().val(num);
    }

    get maxForms() {
        let selector = `#id_${this.prefix}-MAX_FORMS`;
        return parseInt($(selector).val(), 10);
    }

    get template() {
        throw new Exception('Not implemented');
    }

    /**
     * Adds the next form to the formset by rendering the template html and
     * returning it. It's your responsibility to insert the html in the correct
     * place.
     */
    addForm() {
        let index = this.totalForms; // 1 based to 0 based
        let computedPrefix = `${this.prefix}-${index}`;
        let html = this.template.replace(this.id_regex, computedPrefix);
        // update the counter, so the next forms will be added correctly
        this.totalForms += 1;
        return [html, index];
    }

    setData(index, data) {
        for (let key in data) {
            let name = `${this.prefix}-${index}-${key}`;
            $(`[name="${name}"]`).val(data[key]);
        }
    }

    deleteForm() {
        // TODO
    }
}
