/**
 * Handle formsets (adding/removing forms) in a pleasant way.
 *
 * Credit to Django itself: django.contrib.admin.static.admin.js.inlines
 * was an excellent inspiration.
 */

'use strict';

const defaults = {
    formCssClass: 'form',
    template: null,
};

export default class Formset {
    constructor(prefix, options = {}) {
        this.prefix = prefix;
        this.id_regex = new RegExp(`(${prefix}-(\\d+|__prefix__))`, 'g');
        this.options = Object.assign({}, defaults, options);
    }

    _getTotalFormsInput() {
        return document.getElementById(`id_${this.prefix}-TOTAL_FORMS`);
    }

    /**
     * Getter and setter for total form count hidden input
     */
    get totalForms() {
        if (this._getTotalFormsInput()) {
            return parseInt(this._getTotalFormsInput().value, 10);
        }
    }

    set totalForms(num) {
        this._getTotalFormsInput().value = num;
    }

    /**
     * Getter for maximum form count hidden input
     */
    get maxForms() {
        let el = document.getElementById(`id_${this.prefix}-MAX_NUM_FORMS`);
        return parseInt(el.value, 10);
    }

    /**
     * Getter for the template to use.
     *
     * Implement this in your own subclass to use your favourite template engine,
     * or provide the HTML template on instantiation.
     */
    get template() {
        if (!this.options.template) {
            throw new Error('Not implemented');
        }
        return this.options.template;
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
        for (let key of Object.keys(data)) {
            let name = `${this.prefix}-${index}-${key}`;
            document.querySelector(`[name="${name}"]`).value = data[key];
        }
    }

    deleteForm(index) {
        // if a form gets deleted, its index must be determined
        // all following forms' indices must be -1'd, and the total number must
        // be updated
        let attrs = ['id', 'name', 'for', 'class'];

        // loop over all elements with 'options.formCssClass' and remove them if they match
        let re = new RegExp(`${this.prefix}-${index}-`);
        let toRemove = [];

        Array.from(document.getElementsByClassName(`${this.options.formCssClass}`)).forEach((el)=> {
            for (let child of el.children) {

                if (toRemove.includes(el)) return;

                for (let attr of attrs) {
                    if (re.test(child.getAttribute(attr))) {
                        toRemove.push(el);
                        return;
                    }
                }
            }

            toRemove.forEach(el => {
                el.parentNode.removeChild(el);
            })
        });

        // now the DOM node(s) have been removed, update the indices
        let re2 = new RegExp(`(${this.prefix}-(\\d+)-)`);
        for (let el of document.getElementsByClassName(`${this.options.formCssClass}`)) {
            for (let node of el.querySelectorAll('*')) {
                attrs.forEach(attr => {
                    let match = re2.exec(node.getAttribute(attr));
                    if (match) {
                        let _index = parseInt(match[2], 10);
                        let replacement = `${this.prefix}-${_index - 1}-`;
                        node.setAttribute(attr, node.getAttribute(attr).replace(re2, replacement));
                    }
                });
            }
        }

        // if all this was successful, update the total number of forms
        this.totalForms -= 1;
    }
}
