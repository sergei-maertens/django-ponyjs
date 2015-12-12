/* global module */
module.exports = function (config) {
	'use strict';

	config.set({
		autoWatch: true,
		// singleRun: true,
		singleRun: false,

		frameworks: ['jspm', 'mocha', 'chai-sinon', 'es5-shim', 'es6-shim'],

		files: [
			// 'node_modules/babel-core/browser-polyfill.js'
		],

		jspm: {
			configFile: 'src/config.js',
			packages: 'src/jspm_packages',
			loadFiles: [
				'tests/**/*.spec.js'
			],
			serveFiles: [
				'src/**/*.js',
				'src/conf/**/*.json',
			]
		},

		proxies: {
			'/base/conf': '/base/src/conf',
			'/base/ponyjs': '/base/src/ponyjs',
			'/base/jspm_packages': '/base/src/jspm_packages'
		},

		browsers: ['PhantomJS'],

		preprocessors: {
			'tests/**/*.js': ['babel'],
			'src/ponyjs/**/*.js': ['babel', 'sourcemap', 'coverage'],
		},

		babelPreprocessor: {
			options: {
				sourceMap: 'inline',
				blacklist: ['useStrict'],
				// modules: 'system',
			},
			sourceFileName: function(file) {
				return file.originalPath;
			}
		},

		reporters: ['coverage', 'progress'],

		coverageReporter: {
			includeAllSources : true,
			instrumenters: {isparta: require('isparta')},
			instrumenter: {
				'src/ponyjs/**/*.js': 'isparta'
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
