import os

from setuptools import setup, find_packages

import ponyjs


def read_file(name):
    with open(os.path.join(os.path.dirname(__file__), name)) as f:
        return f.read()


readme = read_file('README.rst')
requirements = [
    'django-systemjs',
]
test_requirements = []

setup(
    name='django-ponyjs',
    version=ponyjs.__version__,
    license='MIT',

    # Packaging
    packages=find_packages(exclude=('tests', 'tests.*')),
    install_requires=requirements,
    include_package_data=True,
    extras_require={
        'test': test_requirements,
    },
    tests_require=test_requirements,
    test_suite='tests.runtests.runtests',

    # PyPI metadata
    description='A Django javascript framework',
    long_description='\n\n'.join([readme]),
    author='Sergei Maertens',
    author_email='sergei@modelbrouwers.nl',
    platforms=['any'],
    url='https://github.com/sergei-maertens/django-ponyjs',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Framework :: Django :: 1.8',
        'Intended Audience :: Developers',
        'Operating System :: Unix',
        'Operating System :: MacOS',
        'Operating System :: Microsoft :: Windows',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Javascript',
        'Topic :: Software Development :: Libraries :: Application Frameworks'
    ]
)
