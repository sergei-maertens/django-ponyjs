.. _getting-started:

===============
Getting started
===============

Django PonyJS is written entirely in EcmaScript 6 (ES6, also known as EcmaScript
2015). This is the latest accepted spec for EcmaScript/Javascript and
soon-to-be-available in all major browsers.

ES6 has some real improvements, such as a real module system with proper scoping
in a syntactically pleasant way. The imports almost look like Python imports,
through *arrow functions* the scope of `this` is preserved, 'native' classes,
native `Promises`...

ES7 adds even more interesting features, like decorators!

The code is *transpiled* to ES5, through a transpiler like Babel or Traceur.
This transpiler makes sure all new features that are not yet natively available
in the browser continue to work, by converting the ES6 code to ES5 code.

.. note:: Babel is officially supported. Traceur may work, but is currently
  untested.

To handle all this new and fancy Javascript, ``SystemJS`` is used. It's a
Javascript module loader that understands different formats: ES6 imports,
CommonJS and AMD. This means you can use most libraries that exist in the wild,
even if they come from a different ecosystem.

``jspm`` is a great package manager built on top of ``SystemJS`` for the
browser. Both are written by Guy Bedford, who's been putting in tons of effort
with very little gains, at least check out his work!


Dependencies
============

NodeJS and npm
--------------

On OS-level you'll need ``nodejs`` and ``npm``, node's package manager, which
should come with ``nodejs`` itself.

NPM is used to install ``jspm`` and friends.

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

Next, you'll need to install ``jspm``.

If it's the first time installing, it can be installed globally. Later, the CLI
will run against your version-pinned local ``jspm`` install.

.. code-block:: bash

    npm install -g jspm  # -g flag for global, sudo may be required

Installing globally usually ensures that ``jspm`` is available in your ``$PATH``.

``jspm`` uses Node ``package.json``. If you don't have one yet, you can create
one by running:

.. code-block:: bash

    npm init  # and follow the prompts.


You can now install a local version of ``jspm``, which is recommended to pin
your dependency versions - this helps avoiding surprises.

.. code-block:: bash

    npm install jspm


It's now time to initialize your ``jspm`` project. This is an interactive prompt
again, but we'll need to deviate from the defaults a bit to make it play nice
with Django.

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
  specific use case as it is intended for ``jspm``-users. There is an inherent
  limitation within JSPM which should be lifted with the 0.18 release.


Installing Django PonyJS
========================

``jspm`` has its own registry which fetches packages from ``npm`` and ``github``
by default. PonyJS will always be released on ``github``, and ``github`` only for
the time being. It doesn't make sense to publish on NPM as it's browser-only.

Install a pinned version of PonyJS by running:

.. code-block:: bash

    jspm install ponyjs=github:sergei-maertens/ponyjs@^0.0.4

This installs the library under the **ponyjs** alias, which makes imports more
convenient. You can change the alias to your liking.

Example usage in your own code:


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

For more examples, be sure to check the rest of the documentation.
