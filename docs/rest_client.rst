==================
RESTful API client
==================

The biggest feature of this library - a REST client for your backend.

After declaring your models in Javascript (with minimal code), it's possible
to make asynchronous requests to your backend REST API with an ORM-like
syntax. No need to manually fiddle around with URLs and ``$.ajax``, that's what
PonyJS takes care of.

Of course, this does need a little bit of initial setup/configuration.


Configuring the API endpoint(s)
===============================

To set-up the API communication, your backend needs to be configured.
A single ``json``-file is expected in your ``settings.STATIC_ROOT``:
``conf/api.json``. This file is similar to ``settings.DATABASES``, a
minimum of one backend configuration is expected with the ``default`` key.

Example:

.. code-block:: json

    {
      "default": {
        "baseUrl": "http://example.com",
        "basePath": "api/[version]",
        "options": {
          "version": "v1",
        },
        "csrfCookie": "csrftoken",
        "csrfHeader": "X-CSRFToken",
      }
    }

Currently, only the ``version`` token is supported. All tokens between square
brackets are optional. Another - simpler - example is:

.. code-block:: json

    {
      "default": {
        "baseUrl": "http://api.example.com"
      }
    }


CSRF
----

Django's suggested solution for AJAX and CSRF_ handling is included in a DRY way.
By default PonyJS looks at the ``csrftoken`` cookie and sends the ``X-CSRFToken``
header for POST, PUT and DELETE requests. These cookie and header names can be
configured per API with the ``csrfCookie`` and ``csrfHeader`` keys.

.. _CSRF: https://docs.djangoproject.com/en/stable/ref/csrf/#ajax


Multiple APIs
-------------

If you have multiple APIs to talk to, you have to configure these as well:

.. code-block:: json

    {
      "default": {
        "baseUrl": "http://api.example.com"
      },
      "external": {
        "baseUrl": "http://api.example2.com"
      }
    }

This alias can then be used in querysets:

.. code-block:: js

    Pizza.objects.using('external').all()


.. note:: Authentication options are not possible yet. Token auth / oauth will
   be implemented in a later stage.


Defining models
===============

You already have your models defined on the server-side, so we try to not
violate the DRY principle on the client-side. Models are your layer to access
the API, and as such the backend API is considered to be the
Single-Source-of-Truth.

A model needs just enough information to be able to communicate with the API.

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


By default, endpoints will be built in the form ``baseUrl/app_label/model_name``.
If no ``app_label`` was provided in the model definition, it will be left out.

The auto-generated ``list`` endpoint for ``Pizza`` would be
``http://example.com/api/v1/pizzas/pizza/``, while the ``detail`` endpoint would
be ``http://example.com/api/v1/pizzas/pizza/:id/``. Each ``:key`` is interpolated
with the object itself, so a ``Pizza`` instance ``new Pizza({id: 10})`` would
resolve to ``http://example.com/api/v1/pizzas/pizza/10/``.

These endpoints can be configured:

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


Retrieving data from the API
============================

This process is similar to how Django works, but then ``Promisified`` to deal
with the async nature of HTTP requests.

To retrieve all objects (possibly paginated) from your endpoint, you build a
queryset instance:

.. code-block:: js

    let queryset = Pizza.objects.all();

This queryset is lazy in the sense that you can operate on it, without making the
HTTP request until you call ``then`` on it, which evaluates the queryset and
turns it into an asynchronous request.

This means that you can modify the queryset how you like:

.. code-block:: js

    let queryset = Pizza.objects.all();
    queryset = queryset.filter({foo: 'bar'}).filter({foo: 'baz'});

Each queryset method returns a modified copy of the queryset, leaving the initial
form intact (so you can build base-querysets for example). The arguments to ``filter``
are turned into GET parameters, and specifying the same parameter will append it.

The above example would make a GET request to the url ``/pizzas/pizza/?foo=bar&foo=baz``.

``QuerySet.all`` and ``QuerySet.filter`` make list-calls and will send GET requests
to ``Model._meta.endpoints.list``.

There is also ``QuerySet.get``, which will send the request to the ``detail``
endpoint if parameters are passed in.

.. code-block:: js

    let promise = Pizza.objects.get({id: 10}); // will request Pizza._meta.endpoints.detail

However, it's also possible to call ``.get`` without parameters on a queryset,
and it works similar as Django: it will return the only object matching. It's
possible that this will throw ``MultipleObjectsReturned`` or ``DoesNotExist``
exceptions if the queryset was not correctly constructred.

.. code-block:: js

    let promise = Pizza.objects.filter({id: 10}).get();

Promises
--------

Note that the variable ``promise`` was used in the previous examples. This
indicates how the async nature of XmlHttpRequests works. The requests is fired
and the Javascript continues executing, eventually returning back to the
promise success/error callbacks.

The usage with a regular (list) queryset is like this:

.. code-block:: js

    Pizza.objects.all().then(pizzas => {
        console.log(pizzas); // [<Pizza 1>, <Pizza 2>]
        console.log(pizzas.paginator); // <Paginator> or undefined
    }, (error) => {
        // handle error
    });

    // or, for details

    Pizza.objects.get({id: 1}).then(pizza => {
        pizza.eat();
    });

Entering the promise is done through the ``then`` method of querysets, or the ``get``
method for details. These are the moments where the requests are effectively sent.

The ``pizza`` variables are actual ``Pizza`` model instances, and as such, they
have all methods you defined.

From the first example it can also be seen that on the return value, a ``paginator``
key may be present. This is the case if the response was paginated, and it's a
``ponyjs.models.paginator.Paginator`` instance.
