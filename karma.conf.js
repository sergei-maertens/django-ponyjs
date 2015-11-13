/* global module */
module.exports = function (config) {
	'use strict';

	config.set({
		autoWatch: true,
		singleRun: true,

		frameworks: ['jspm', 'mocha', 'sinon-chai'],

		files: [
			'node_modules/babel-core/browser-polyfill.js'
		],

		jspm: {
			configFile: 'ponyjs/static/config.js',
			packages: 'ponyjs/static/jspm_packages',
			loadFiles: [
				'tests/**/*.spec.js'
			],
			serveFiles: [
				'ponyjs/static/ponyjs/**/*.js'
			]
		},

		proxies: {
			'/base': '/base/ponyjs/static'
		},

		browsers: ['PhantomJS'],

		preprocessors: {
			'tests/**/*.js': ['babel'],
			'ponyjs/static/ponyjs/**/*.js': ['babel', 'sourcemap', 'coverage'],
		},

		babelPreprocessor: {
			options: {
				sourceMap: 'inline',
				blacklist: ['useStrict']
			},
			sourceFileName: function(file) {
				return file.originalPath;
			}
		},

		reporters: ['coverage', 'progress'],

		coverageReporter: {
			instrumenters: {isparta: require('isparta')},
			instrumenter: {
				'ponyjs/static/ponyjs/**/*.js': 'isparta'
			},

			reporters: [
				{
					type: 'text-summary',
					subdir: normalizationBrowserName
				},
				{
					type: 'html',
					dir: 'coverage/',
					subdir: normalizationBrowserName
				},
				{
					type: 'lcov',
					dir: 'coverage/'
				}
			]
		}
	});

	function normalizationBrowserName(browser) {
		return browser.toLowerCase().split(/[ /-]/)[0];
	}
};
