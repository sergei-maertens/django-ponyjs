/* global beforeEach, describe, expect, it.skip, sinon, fixture */
'use strict';

import Formset from 'ponyjs/forms/formsets.js';


describe('Formsets', () => {

    let result;

    let form = {
        template: '<div class="new-form">myfs-__prefix__</div>',

        get numInitial() {
            return document.getElementsByClassName('form').length;
        },

        get numNew() {
            return document.getElementsByClassName('new-form').length;
        },

        get numTotal() {
            let input = document.getElementById('id_myfs-TOTAL_FORMS');
            return parseInt(input.value, 10);
        },
    };

    beforeEach(() => {
        result = fixture.load('formsets/formset.html');
    });

    afterEach(() => {
        fixture.cleanup();
    });

    it('should increment the total form count on form add', () => {
        expect(form.numInitial).to.equal(3);
        expect(form.numNew).to.equal(0);
        expect(form.numTotal).to.equal(2);

        let formset = new Formset('myfs', {template: form.template});
        let [html, index] = formset.addForm();
        expect(html).to.equal('<div class="new-form">myfs-2</div>');
        expect(index).to.equal(2);

        expect(form.numTotal).to.equal(3);
        expect(formset.totalForms).to.equal(3);

        // developer has to manually insert the HTML in the DOM
        expect(form.numNew).to.equal(0);
    });

});
