/* global beforeEach, describe, expect, it.skip, sinon */
'use strict';
import { Field, StringField } from 'ponyjs/models/fields/fields';


describe('Base model fields', () => {

    it('should be able to take a name', () => {
        let field = new Field('myfield');
        expect(field.verbose_name).to.be.equal('myfield');
    });

    it('should be able to set new values');

    it('should mark the model instance dirty');

    it('should not mark the model instance dirty if the original value was set');
});


describe('String fields', () => {

    it('should have a max_length property', () => {
        let field = new StringField();
        expect(field.max_length).to.not.be.undefined;

        let field2 = new StringField('field', {max_length: 150});
        expect(field2.max_length).to.be.equal(150);
    })

    it('should have a String type property', () => {
        expect(StringField.type).to.be.equal(String);
    });

    it('should typecast non-string values');

});
