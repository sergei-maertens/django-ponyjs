/**
 * Handle formsets (adding/removing forms) in a pleasant way.
 *
 * Credit to Django itself: django.contrib.admin.static.admin.js.inlines
 * was an excellent inspiration.
 */

'use strict';

import $ from 'jquery';


const defaults = {
    formCssClass: 'form',
    template: null,
};


export default class Formset {
    constructor (prefix, options={}) {
        this.prefix = prefix;
        this.id_regex = new RegExp(`(${prefix}-(\\d+|__prefix__))`, 'g');
        this.options = $.extend(true, {}, defaults, options);
    }

    _getTotalFormsInput() {
        return $(`#id_${this.prefix}-TOTAL_FORMS`);
    }

    /**
     * Getter and setter for total form count hidden input
     */
    get totalForms() {
        return parseInt(this._getTotalFormsInput().val(), 10);
    }

    set totalForms(num) {
        this._getTotalFormsInput().val(num);
    }

    /**
     * Getter for maximum form count hidden input
     */
    get maxForms() {
        let selector = `#id_${this.prefix}-MAX_NUM_FORMS`;
        return parseInt($(selector).val(), 10);
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
        for (let key in data) {
            let name = `${this.prefix}-${index}-${key}`;
            $(`[name="${name}"]`).val(data[key]);
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
        $(`.${this.options.formCssClass}`).each((i, el) => {
            $(el).find('*').each((j, child) => {
                if (toRemove.indexOf(el) > -1) {
                    return;
                }
                attrs.forEach(attr => {
                    if (re.test($(child).attr(attr))) {
                        toRemove.push(el);
                        return;
                    }
                });
            });

            toRemove.forEach(el => {
                $(el).remove();
            })
        });

        // now the DOM node(s) have been removed, update the indices
        let re2 = new RegExp(`(${this.prefix}-(\\d+)-)`);
        $(`.${this.options.formCssClass}`).each((i, el) => {
            $(el).find('*').each((j, node) => {
                $node = $(node);
                attrs.forEach(attr => {
                    let match = re2.exec($node.attr(attr));
                    if (match) {
                        let _index = parseInt(match[2], 10);
                        let replacement = `${this.prefix}-${_index-1}-`;
                        $node.attr(attr, $node.attr(attr).replace(re2, replacement));
                    }
                });
            });
        });

        // if all this was succesful, update the total number of forms
        this.totalForms -= 1;
    }
}
