Related Django packages
-------------------------

Django Rest Framework
*********************

The API interaction is being based on DRF, so it should work (almost) out of the box.

Current limitations are that only ``json`` output is supported, so be sure to
leave the ``JSONRenderer`` enabled. PonyJS sends the appropriate headers, which
are handled correctly by DRF.

Pagination
++++++++++

PonyJS automagically tries to detect if a response is paginated or not - if it's
a Javascript Object (curly braces) that get returned from GET ``list`` calls, it
is assumed that the response is paginated. Else, it's not.

As the server handles pagination, it's not (easily) possible on the client to
figure out the ``paginate_by`` configuration, which may even vary by endpoint.
To be able to build the paginator correctly, it is required that you include the
``paginate_by`` output in your paginator class. This can be configured as such:

.. code-block:: python

  # in settings.py
  REST_FRAMEWORK = {
      'DEFAULT_PAGINATION_CLASS': 'project.api.pagination.PageNumberPagination',
      ...
  }

  # project/api/pagination.py
  from rest_framework.pagination import PageNumberPagination


  class PageNumberPagination(PageNumberPagination):

      def get_paginated_response(self, data):
          response = super(PageNumberPagination, self).get_paginated_response(data)
          response.data['paginate_by'] = self.get_page_size(self.request)
          return response


Tastypie
********

Currently unsupported. Create a Github issue or submit a PR to add support.


Django-SystemJS
***************

Django SystemJS integrates Django and ``jspm``. It provides a templatetag and
management command that wrap around the ``jspm`` CLI. It makes it easy to discover
and bundle ``jspm`` apps in your project.
