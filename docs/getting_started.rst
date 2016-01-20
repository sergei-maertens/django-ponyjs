===============
Getting started
===============


Django PonyJS is written entirely in EcmaScript 6 (ES6, also known as EcmaScript
2015). This basically boils down to real modules in Javascript, akin to Python-
like imports, and a bunch of other nice features.

The code is *transpiled* to ES5, through a transpiler like Babel or Traceur.

.. note:: Babel is officially supported. Traceur may work, but is currently
  untested in Travis.

To handle all this 'irregular' Javascript stuff, ``jspm`` with ``SystemJS`` is
used for package management and module loading.

Dependencies
============

NodeJS and npm
--------------

On OS-level you'll need ``nodejs`` and ``npm``, node's package manager, which
should come with ``nodejs`` itself.

.. code-block:: bash

    apt-get install nodejs

or for other operating systems:

.. code-block:: bash

    yum install nodejs
    brew install node
    pacman -S nodejs npm

See the `NodeJS github <https://github.com/nodejs/node-v0.x-archive/wiki/Installing-Node.js-via-package-manager>`_ for more documentation.


JSPM
----

Next, you'll need to install ``jspm``. Install the CLI globally the first time,
so it's available in your ``$PATH``.

.. code-block:: bash

    npm install -g jspm

``jspm`` uses Node ``package.json``. If you don't have one yet, you can create
one by running:

.. code-block:: bash

    npm init  # and follow the prompts.

You can now install a local version of ``jspm``, which is recommended to pin
your dependency versions - this helps avoiding surprises.

.. code-block:: bash

    npm install jspm


It's now time to initialize your ``jspm`` project. This is an interactive prompt
again, but we'll need to deviate from the defaults a bit.

.. code-block:: bash

    jspm init

    Would you like jspm to prefix the jspm package.json properties under jspm? [yes]: yes  # easier to keep track of jspm-specific settings/packages

    Enter server baseURL (public folder path) [/]: static  # same as settings.STATIC_ROOT, relative to package.json

    Enter jspm packages folder [static/jspm_packages]:  # keep it within settings.STATIC_ROOT

    Enter config file path [static/config.js]: my-project/static/config.js  # must be kept in version control, so somewhere where collectstatic can find it

    Enter client baseURL (public folder URL) [/]: /static/ # set to settings.STATIC_URL

    Do you wish to use a transpiler? [yes]: # current browsers don't have full support for ES6 yet

    Which ES6 transpiler would you like to use, Traceur or Babel? [traceur]: babel  # better tracebacks


Take some time to read the `JSPM docs <https://github.com/jspm/jspm-cli/tree/master/docs>`_
if you're not familiar with it yet.

.. note::
  A few settings are remarkable. We placed ``jspm_packages`` in
  ``settings.STATIC_ROOT``. This means that collectstatic will not post-process
  the files in here, which can be a problem.
  `Django SystemJS <https://pypi.python.org/pypi/django-systemjs>`_ handles this
  specific use case as it is intended for ``jspm``-users.


Installing Django PonyJS
========================

``jspm`` has its own registry which fetches from ``npm`` and ``github`` by
default. PonyJS will always be released on ``github``, and ``github`` only for
the time being.

Install a certain version of Django PonyJS by running:

.. code-block:: bash

    jspm install ponyjs=github:sergei-maertens/ponyjs@^0.0.3

This installs the library under the `ponyjs` alias, which makes imports more
convenient. You can change the alias to your liking.

Usage in your own code:


.. code-block:: js

    import $ from 'jquery';
    import { Model } from 'ponyjs/models.js';


    let Pizza = Model('Pizza');

    $('#my-button').on('click', function(event) {
        event.preventDefault();

        Pizza.objects.filter({name__startswith: 'diablo'}).then(pizzas => {
            // do something with pizzas, which is a list of Pizza instances.
        });

        return false;
    });




