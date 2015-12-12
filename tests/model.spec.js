/* global beforeEach, describe, expect, it.skip, sinon */
'use strict';

import { ModelBase, Model } from 'ponyjs/models/base';
import { Options } from 'ponyjs/models/base';
import Manager from 'ponyjs/models/manager';
import { IntegerField, StringField, FloatField } from 'ponyjs/models/fields/fields';


describe('Base model class', () => {

    // beforeEach(() => {
    //   this.sinon = sinon.sandbox.create();
    // });

    afterEach(() => {
        if (ModelBase._default_manager) {
            delete ModelBase._default_manager;
        }
        if (ModelBase._meta) {
            delete ModelBase.__meta;
        }
        // this.sinon.restore();
    });

    it('should have a _meta property', () => {
        class MyModel extends ModelBase {}
        expect(MyModel._meta).to.be.instanceof(Options);
        expect(MyModel._meta.app_label).to.equal(null);
        expect(MyModel._meta.name).to.equal('MyModel');
        // expect(meta.endpoints).to.equal({});
    });

    it('should call Meta() on the real model class', () => {
        class MyModel extends ModelBase {
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
        expect(ModelBase.objects).to.be.instanceof(Manager);
    });

    it('should have a lazy meta class', () => {
        class MyModel extends ModelBase {};
        expect(MyModel.__meta).to.be.undefined;
        MyModel._meta;
        expect(MyModel.__meta).not.to.be.undefined;
        expect(MyModel._meta).to.be.equal(MyModel.__meta);
    });

    it('should have a lazy default manager', () => {
        expect(ModelBase._default_manager).to.be.undefined;
        ModelBase.objects;
        expect(ModelBase._default_manager).not.to.be.undefined;
        expect(ModelBase.objects).to.be.equal(ModelBase._default_manager);
    });

    describe('Concrete model classes', () => {
        beforeEach(() => {
            class MyModel extends ModelBase {
                static Meta() {
                    return {
                        app_label: 'tests',
                        name: 'MyModel',
                        endpoints: {
                            list: '/tests/mymodel/',
                            detail: '/tests/mymodel/:id'
                        }
                    }
                }
            }
            this.model = MyModel;
        });

        it('should accept all properties as field values', () => {
            var obj = new this.model({foo: 'bar', baz: 'foo'});
            expect(obj.foo).to.equal('bar');
            expect(obj.baz).to.equal('foo');
        });

        it('should be able to add endpoints', () => {
            this.model._meta.setEndpoints({
                extra: '/tests/mymodel/:id/extra/'
            });
            expect(this.model._meta.endpoints).to.deep.equal({
                list: '/tests/mymodel/',
                detail: '/tests/mymodel/:id',
                extra: '/tests/mymodel/:id/extra/'
            });
        });
    });

});


describe('Model classes', () => {
    it('should be able to be declaritively-ish defined ', () => {
        class MyModel extends Model('MyModel', {
            id: new IntegerField(),
            name: new StringField(),
            amount: new FloatField(),

            private: new Manager(),

            Meta: {
                app_label: 'app',
            }
        }) {}

        let fields = MyModel._meta.fields;
        expect(fields.id).to.be.instanceof(IntegerField);
        expect(fields.name).to.be.instanceof(StringField);
        expect(fields.amount).to.be.instanceof(FloatField);

        expect(MyModel.private).to.be.instanceof(Manager);
        expect(MyModel._meta.model_name).to.equal('mymodel');
        expect(MyModel._meta.app_label).to.equal('app');
    })
});
