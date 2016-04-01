.. _rest-client-usage:

=====
Usage
=====

.. _retrieving-data:

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


Creating/updating/deleting data through the API
===============================================

Other than :ref:`retrieving <retrieving-data>` data, it must also be possible to
do write actions via the API.

Create
------

Similar to Django's ORM, managers support the ``create`` method. This lets you
run code like:

.. code-block:: js

    let promise = Pizza.objects.create({
      name: 'Hawaii',
      vegan: false,
    });


This method returns a promise as well, which eventually resolves to a model
instance based on the REST API response.

If server side validations occur, these are available in the ``catch`` promise
handler:

.. code-block:: js

    Pizza.objects.create({
        vegan: 'invalid-value',
    }).then(pizza => {
      // ...
    }).catch(errors => {
      console.log(errors);
      // {
      //    'name': 'This field is required.',
      //    'vegan': 'Fill in a valid value.',
      // }
    });


.. warning::
  At this point, validation errors are detected by looking at the
  HttpResponse status code. If a HTTP 400 is detected, the error is wrapped in
  a ``ponyjs.models.query.ValidationError`` instance. If a different HTTP status
  code is returned (like a 50x), the ``errors`` variable will look different.

  This will be redesigned, but for the time being it's your responsibility to
  check the type of error.

Update
------

WIP

Delete
------

WIP
