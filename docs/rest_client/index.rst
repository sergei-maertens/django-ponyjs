==================
RESTful API client
==================

The biggest feature of this library (so far) is a REST client for your backend.

After declaring your models in Javascript (with minimal code), it's possible
to make asynchronous requests to your backend REST API with an ORM-like
syntax. No need to manually fiddle around with URLs and ``$.ajax``, that's what
PonyJS takes care of.

Of course, this does need a little bit of initial setup/configuration, which is
outlined in three separate documents.


.. toctree::
    :maxdepth: 1

    api
    models
    usage


You'll need to create a json file with API information before you can make any
requests. How to set this up is outlined in :ref:`rest-client-api-setup`.

After that, you'll need to set up some minimal 'models' to interact with
the API, see :ref:`rest-client-models`. Essentially, here you specify which
endpoints to use and how to interpret the serializer output.

Once your models have been setup, you can actually start :ref:`using them <rest-client-usage>`.
This is implemented with the concept of ``Promises`` to deal with the
asynchronous nature. A quick example may look like this:

.. code-block:: js

    Pizza.objects.filter({vegan: true}).then(pizzas => {
        menu.render(pizzas);
    });

See the :ref:`usage <rest-client-usage>` documentation for more details.
