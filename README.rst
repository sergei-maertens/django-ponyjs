Django PonyJS
================

.. image:: https://travis-ci.org/sergei-maertens/django-ponyjs.svg?branch=develop
    :target: https://travis-ci.org/sergei-maertens/django-ponyjs


.. image:: https://coveralls.io/repos/sergei-maertens/django-ponyjs/badge.svg?branch=develop&service=github
    :target: https://coveralls.io/github/sergei-maertens/django-ponyjs?branch=develop


A Javascript framework for Django!

Current status
--------------
Django PonyJS is under heavy development. This means that
documentation is out of date more often than not, while we
make and change design decisions.

Installation
------------

    $ pip install django-ponyjs

Add `ponyjs` to INSTALLED_APPS.

Dependencies
------------

Django PonyJS depends on JSPM/SystemJS. In short, this allows you to use ES6,
which is transpiled into ES5 code for the browser until ES6 is supported
everywhere.

To install jspm, you'll need the node package manager, npm.

    $ sudo apt-get install npm

or

    $ yum install npm

or

    $ brew install npm

\... you know the gist.

Next, install jspm:

    $ npm install jspm

JSPM uses your node package.json. Initialize the JSPM configuration, below is
the recommended set-up, assuming that your django code lives in src/my-django-project.

    $ jspm init

      Would you like jspm to prefix the jspm package.json properties under jspm? [yes]: yes

      Enter server baseURL (public folder path) [/]: src/my-django-project/static

      Enter jspm packages folder [src/my-django-project/static/jspm_packages]:  # add this directory to .gitignore or .hgignore

      Enter config file path [src/my-django-project/static/static/config.js]:

      Enter client baseURL (public folder URL) [/]: /static/ # set to settings.STATIC_URL

      Which ES6 transpiler would you like to use, Traceur or Babel? [traceur]: babel  # better tracebacks

You can now start installing dependencies, e.g.:

    $ jspm install jquery

Read the official jspm docs for more information.

.. note::
    django-ponyjs depends on:

    * jQuery: for ajax and small things. This should/will soon be replaced by a more lightweight library.
    * Q for promises, although this might get replaced with native ES6 promises
    * Handlebars as template engine, although the plan is to make this optional/pluggable so your
      template library of choice can be used.



Unit testing setup via https://sean.is/writing/client-side-testing-with-mocha-and-karma/
