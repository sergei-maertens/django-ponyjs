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
        this.options = $.extend(true, defaults, options);
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
        let selector = `#id_${this.prefix}-MAX_FORMS`;
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

    deleteForm() {
        // if a form gets deleted, its index must be determined
        // all following forms' indices must be -1'd, and the total number must
        // be updated

        // extracted from django.contrib.admin.static.admin.js.inlines
        // row.find("a." + options.deleteCssClass).click(function(e1) {
        //     e1.preventDefault();
        //     // Remove the parent form containing this button:
        //     row.remove();
        //     nextIndex -= 1;
        //     // If a post-delete callback was provided, call it with the deleted form:
        //     if (options.removed) {
        //         options.removed(row);
        //     }
        //     $(document).trigger('formset:removed', [row, options.prefix]);
        //     // Update the TOTAL_FORMS form count.
        //     var forms = $("." + options.formCssClass);
        //     $("#id_" + options.prefix + "-TOTAL_FORMS").val(forms.length);
        //     // Show add button again once we drop below max
        //     if ((maxForms.val() === '') || (maxForms.val() - forms.length) > 0) {
        //         addButton.parent().show();
        //     }
        //     // Also, update names and ids for all remaining form controls
        //     // so they remain in sequence:
        //     var i, formCount;
        //     var updateElementCallback = function() {
        //         updateElementIndex(this, options.prefix, i);
        //     };
        //     for (i = 0, formCount = forms.length; i < formCount; i++) {
        //         updateElementIndex($(forms).get(i), options.prefix, i);
        //         $(forms.get(i)).find("*").each(updateElementCallback);
        //     }
        // });
    }
}
