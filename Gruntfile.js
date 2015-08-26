module.exports = function(grunt) {
    'use strict';

    // Load the plugins that provide the tasks we specified in package.json
    require('load-grunt-tasks')(grunt);

    require('phantomjs-polyfill');

    grunt.initConfig({
        karma : {
            options: {
                // Configuration options that tell Karma how to run
                configFile: 'karma.conf.js'
            },

            dev: {
                // On our local environment we want to test all the things!
                singleRun: false,
                browsers: [/*'Chrome', 'Firefox', */'PhantomJS']
            },

            // For production, that is to say, our CI environment, we'll
            // run tests once in PhantomJS browser.
            prod: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        }
    });

    grunt.registerTask('default', ['karma:dev']);
};
