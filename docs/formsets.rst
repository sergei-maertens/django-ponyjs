.. _formsets:

========
Formsets
========

Formsets are a great tool in Django to be able to quickly edit related objects,
or edit a set of objects on one page. They are frequently used to be able to
add an arbitry number of objects, or delete some objects.

Formsets operate with a prefix and an index to be able to distinguish the
different forms (each 'formset form' represents an object, or maybe just an
arbitrary form).

Formsets combined with Javascript to add/remove forms in the page without a full
page reload are powerfull, but crufty: you need to manually keep track of the
number of forms and make sure that the indices don't make any 'jumps', else
Django might complain.

The ``admin`` has a JS module to handle that fairly generic:
``django.contrib.admin.static.admin.js.inlines``, but it dictates a certain
markup.

The ``Formset`` class from ponyJS is a more generic implementation. It's an OOP
orientation to handle adding/removing forms painless.


Basic usage
===========

Usage is simple: import the class and instantiate an instance.

It does require you to specify the template for a new form, because no
assumptions are made whether you use HTML templates, React or any other tool.
See :ref:`formset-template` for more details.

The constructor takes two arguments, the first one is required: the ``prefix``
of the formset. The second one is an optional object with :ref:`options <formset-options>`.


.. code-block:: js

    import Formset from 'ponyjs/forms/formsets.js';

    let formset = Formset('form');


.. _formset-add-form:

Adding a form
-------------

Adding a form takes care of rendering the template to a new form and incrementing
the total form count in the formset management form. It's your responsibility
to insert the form HTML in the DOM where you want it. The returned index is the
new index of the added form.

.. code-block:: js

    let [html, index] = formset.addForm();
    // $('#my-node').append(html);


.. _formset-set-data:

Setting form data
-----------------

If you need to update the form data for a certain index, there's an utility
function: ``Formset.setData``. It takes an index and an object of **unprefixed**
form field names:

.. code-block:: js

    formset.setData(3, {'my-input': 'new value'});


.. _formset-delete-form:

Deleting a form
---------------

To delete a form, you need to know it's index.

Deleting a form takes care of removing the form node from the DOM, determined by
``Formset.options.formCssClass`` and updates the total form count.

.. code-block:: js

    formset.deleteForm(2);


.. _formset-options:

Options
=======

The formset instance can take an options object.

.. code-block:: js

    // defaults are shown
    let options = {
        // the CSS class that wraps a single form. Required for Formset.deleteForm
        formCssClass: 'form',
        // a possible template string for a new form. All ``__prefix__``
        // occurrences will be replaced with the new index.
        template: null,
    }


.. _formset-template:

New form template
=================

There are two ways to specify the template for a new form: supply it as a string
in the options, or override the ``template`` property by subclassing ``Formset``.

Specify template as an option
-----------------------------

This is probably the most straight-forward way, but violates DRY:

.. code-block:: js

    let formset = new Formset('my-prefix', {
        template: '<div class="form"><input name="my-prefix-__prefix__-my_input"></div>'
    });

It leads to big HTML chunks in your Javascript, and is therefore not recommended.


Subclass ``Formset``
--------------------

This is the best 'DRY' method: you can put ``{{ formset.empty_form }}``
somewhere in your template, wrapped in a div with an ID ``empty-form`` for
example. Django renders the entire formset form with a ``__prefix__`` index.

To use that as a template, you simple do:

.. code-block:: js

    class MyFormset extends Formset {
        get template() {
            if (!this._template) {
                this._template = $('#empty-form').html();
            }
            return this._template;
        }
    }

The `Formset.template` property is a getter, and it's thus possible to cache
the template on the instance, as seen in the example.

You could also use a client side template engine to render the formset template
from somewhere.


Formset properties
==================

Each ``Formset`` instances has some public properties/attributes.

* ``Formset.totalForms``: this reports the total amount of forms
  according to the hidden input from the management form. It's both
  a getter and a setter.

* ``Formset.maxForms``: reports the maximum number of allowed forms
  according to the hidden input from the management form. Getter only.

* ``Formset.template``: returns the template used for rendering the
  new form. Getter only. Throws ``Error('Not implemented')`` if the
  template has not been specified.

* ``Formset.addForm``: see :ref:`formset-add-form`.

* ``Formset.setData``: see :ref:`formset-set-data`.

* ``Formset.deleteForm``: see :ref:`formset-delete-form`.
