/* global beforeEach, describe, expect, it */
'use strict';

import Model from 'ponyjs/models/base';
import { Options } from 'ponyjs/models/base';
import Manager from 'ponyjs/models/manager';


describe('Base model class', () => {

    it('should have a _meta property', () => {
        class MyModel extends Model {}
        expect(MyModel._meta).to.be.instanceof(Options);
        expect(MyModel._meta.app_label).to.equal(null);
        expect(MyModel._meta.name).to.equal('MyModel');
        // expect(meta.endpoints).to.equal({});
    });

    it('should call Meta() on the real model class', () => {
        class MyModel extends Model {
            static Meta() {
                return {
                    app_label: 'tests',
                    name: 'MyModel',
                    ordering: ['id'],
                    endpoints: {}
                }
            }
        }

        expect(MyModel._meta.app_label).to.equal('tests');
        expect(MyModel._meta.name).to.equal('MyModel');
    });

    it('should have a default manager called \'objects\'', () => {
        expect(Model.objects).to.be.instanceof(Manager);
    });

    it('should have lazy getters');

});
