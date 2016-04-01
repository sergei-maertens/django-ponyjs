.. _rest-client-api-setup:

===============================
Configuring the API endpoint(s)
===============================

To set-up the API communication, your backend needs to be configured.
A single ``json``-file is expected in your ``settings.STATIC_ROOT``:
``conf/api.json``. This file is similar to ``settings.DATABASES``, where a
minimum of one backend configuration is expected with the ``default`` key.

Example of ``myproject/myproject/static/conf/api.json``:

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
====

Django's suggested solution for AJAX and CSRF_ handling is included in a DRY way.
By default PonyJS looks at the ``csrftoken`` cookie and sends the ``X-CSRFToken``
header for POST, PUT and DELETE requests. These cookie and header names can be
configured per API with the ``csrfCookie`` and ``csrfHeader`` keys.

.. _CSRF: https://docs.djangoproject.com/en/stable/ref/csrf/#ajax


Multiple APIs
=============

If you have multiple APIs to talk to, you have to configure these as well:

.. code-block:: json

    {
      "default": {
        "baseUrl": "http://api.example.com"
      },
      "external": {
        "baseUrl": "http://other-api.example.com"
      }
    }

This alias can then be used in querysets:

.. code-block:: js

    Pizza.objects.using('external').all()


.. note:: Authentication options are not possible yet. Token auth / oauth will
   be implemented in a later stage.
