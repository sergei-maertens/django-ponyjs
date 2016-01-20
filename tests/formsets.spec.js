/* global beforeEach, describe, expect, it.skip, sinon, fixture */
'use strict';

import Formset from 'ponyjs/forms/formsets.js';


describe('Formsets', () => {

    let result;

    let form = {
        template: '<div class="new-form">myfs-__prefix__</div>',

        get count() {
            return document.getElementsByClassName('form').length;
        },

        get numNew() {
            return document.getElementsByClassName('new-form').length;
        },

        get numTotal() {
            let input = document.getElementById('id_myfs-TOTAL_FORMS');
            return parseInt(input.value, 10);
        },

        field: function(index) {
            return document.getElementById(`id_myfs-${index}-field`).value;
        }
    };

    beforeEach(() => {
        result = fixture.load('formsets/formset.html');
    });

    afterEach(() => {
        fixture.cleanup();
    });

    it('should be able to read the hidden fields', () => {
        let formset = new Formset('myfs');
        expect(formset.totalForms).to.equal(2);
        expect(formset.maxForms).to.equal(1000);
    });

    it('should increment the total form count on form add', () => {
        expect(form.count).to.equal(3);
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

    it('should throw if no template is configured', () => {
        let formset = new Formset('prefix');
        expect(() => formset.addForm()).to.throw('Not implemented');

        class MyFS extends Formset {
            get template() {
                return 'tpl';
            }
        }
        let myfs = new MyFS('prefix');
        expect(() => myfs.addForm()).to.not.throw('Not implemented');
    });

    it('should be able to write values for a form', () => {
        let formset = new Formset('myfs');
        formset.setData(1, {field: 'new value'});
        expect(form.field(1)).to.equal('new value');
    });

    it('must be able to remove child forms', () => {
        let formset = new Formset('myfs', {formCssClass: 'form'});
        formset.setData(1, {field: 'new value'});
        expect(form.count).to.equal(3); // with hidden form
        formset.deleteForm(0);
        expect(form.count).to.equal(2);

        // check that the remaining items have been re-indexed
        let deleted = document.getElementById('id_myfs-1-field');
        expect(deleted).to.be.null;
        let deletedbis = document.getElementById('id_myfs-0-field');
        expect(deletedbis).not.to.be.null;

        // check that other props are properly replaced (for, class, id, name)
        let deleted2 = document.getElementsByName('myfs-1-id');
        expect(deleted2.length).to.equal(0);
        let deleted2bis = document.getElementsByName('myfs-0-id');
        expect(deleted2bis.length).to.equal(1);
        let deleted3 = document.querySelectorAll('[for="id_myfs-1-field"]');
        expect(deleted3.length).to.equal(0);
        let deleted3bis = document.querySelectorAll('[for="id_myfs-0-field"]');
        expect(deleted3bis.length).to.equal(1);

        // index 1 -> became index 0, test by checking the input value
        expect(form.field(0)).to.equal('new value');
        expect(formset.totalForms).to.equal(1);
    });

});
