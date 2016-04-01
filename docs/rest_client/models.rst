.. _rest-client-models:

===============
Defining models
===============

You already have your models defined on the server-side, so we try to not
violate the DRY principle on the client-side. Models are your layer to access
the API, and as such the backend API is considered to be the
Single-Source-of-Truth.

A model needs just enough information to be able to communicate with the API.

.. note::
  Unfortunately, Javascript doesn't have true multiple inheritance and/or meta
  classes, so the model-definition can seem a bit awkward.


.. code-block:: js

   import { Model } from 'ponyjs/models.js';

   // provide the model name + declaration of fields/meta/managers
   class Pizza extends Model('Pizza', {
       Meta: {
           app_label: 'pizzas'
       }
   });



Endpoint configuration
======================

By default, endpoints will be built in the form ``{baseUrl}/app_label/model_name``.
If no ``app_label`` was provided in the model definition, it will be left out.

The auto-generated ``list`` endpoint for ``Pizza`` would be
``http://example.com/api/v1/pizzas/pizza/``, while the ``detail`` endpoint would
be ``http://example.com/api/v1/pizzas/pizza/:id/``. Each ``:key`` is interpolated
with the object itself, so a ``Pizza`` instance ``new Pizza({id: 10})`` would
resolve to ``http://example.com/api/v1/pizzas/pizza/10/``.

These auto-discovered endpoints can ofcourse be specified manually:

.. code-block:: js

    class Pizza extends Model('Pizza', {
        Meta: {
            app_label: 'pizzas',
            endpoints: {
                list: 'my_pizzas/p/',
                detail: 'my_pizzas/p/:slug/'
            }
        }
    });

The ``list`` url would then become ``http://example.com/api/v1/my_pizzas/p/`` and
``detail`` becomes ``http://example.com/api/v1/my_pizzas/p/:slug/``.


It's also possible to specify an alternative API for a model:

.. code-block:: js

    import { Manager } from 'ponyjs/models/manager.js';

    class Pizza extends Model('Pizza', {

        objects: new Manager('external'),

        Meta: {
            app_label: 'pizzas'
        }
    });


This configures the default manager (``objects``) to talk to the alternative
url.
