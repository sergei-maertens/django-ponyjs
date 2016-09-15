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

   // Provide the model name + declaration of fields/meta/managers
   // If `model_name` is omitted, lower case representation of the model's name is used
   class Pizza extends Model('Pizza', {
       Meta: {
           app_label: 'pizzas',
           model_name: 'pizza'
       }
   });


Dealing with relations
======================

Dealing with related fields based on the API output is hard, because there's a
lot of variance in possible outputs. The django-rest-framework ``RelatedField``
classes were used for a reference implementation.

It's your job as a developer to specify what kind of data is expected from the
API for related fields.

Consider a simple Book-Author relation, where Book has a ForeignKey to Author.
An example response for a book-detail could be:

.. code-block:: json

    # GET /api/v1/books/book/42/
    {
      id: 42,
      title: 'The meaning of life',
      author: 7
    }

In this particular case, the serializer outputs the primary key of the related
object for the actual field. So, to access ``book.author`` in Javascript, an
extra API request needs to be made to retrieve that author:

.. code-block:: json

    # GET /api/v1/author/7/
    {
      id: 7,
      first_name: 'Oscar',
      last_name: 'Wilde'
    }

However, there are other possible outputs, like nested objects:

.. code-block:: json

    # GET /api/v1/books/book/42/
    {
      id: 42,
      title: 'The meaning of life',
      author: {
        id: 7,
        first_name: 'Oscar',
        last_name: 'Wilde'
      }
    }


So, to be able to differentiate between the possible outputs, explicit
relation-field setup is required:


.. code-block:: js

    import { Model, NestedRelatedField, PrimaryKeyRelatedField } from 'ponyjs/models.js';

    let Author = Model('Author');

    let Book = Model('Book', {
        author: NestedRelatedField(Author),
        Meta: {
            app_label: 'books',
        }
    });

    let Book2 = Model('Book', {
        author: PrimaryKeyRelatedField(Author),
        Meta: {
            app_label: 'books',
        }
    });


Then, when you retrieve the actual book instance, you can access the related
field through a :ref:`promise <rest-client-usage-promises>`, and you will get
an actual ``Author`` instance back:

.. code-block:: js

    // GET /api/v1/books/book/42/
    let book = Book.objects.get({id: 42});
    book.author.then(author => {
        console.log(author instanceof Author);
        // true
    });


.. note::
    Due to the asynchronous nature of Javascript, promises must be used to access
    related fields because they can potentially send out extra network requests
    (for example with PrimaryKeyRelatedFields). If no extra requests are needed,
    the promise resolves instantly.


Endpoint configuration
======================

By default, endpoints will be built in the form ``{baseUrl}/app_label/model_name``.
If no ``app_label`` was provided in the model definition, it will be left out.

The auto-generated ``list`` endpoint for ``Pizza`` would be
``http://example.com/api/v1/pizzas/pizza/``, while the ``detail`` endpoint would
be ``http://example.com/api/v1/pizzas/pizza/:id/``. Each ``:key`` is interpolated
with the object itself, so a ``Pizza`` instance ``new Pizza({id: 10})`` would
resolve to ``http://example.com/api/v1/pizzas/pizza/10/``.

These auto-discovered endpoints can of course be specified manually:

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


Define model against the non-default api
========================================

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
