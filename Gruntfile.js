/*
 * grunt-fe-wget
 * https://github.com/fedeoo/grunt-fe-wget
 *
 * Copyright (c) 2014 fedeoo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    fe_wget: {
        options: {
            dest: 'js'
        },
        // default_options: {
        //     options: {
        //     },
        //     files: {
        //         'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
        //     },
        // },
        // custom_options: {
        //     options: {
        //         separator: ': ',
        //         punctuation: ' !!!',
        //     },
        //     files: {
        //         'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
        //     },
        // },
        libs: [
            'bootstrap',
            {
                name: 'd3',
                url: 'https://github.com/mbostock/d3',
                dest: ''
            }
        ],
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'fe_wget', 'nodeunit']);

  // debug
  grunt.registerTask('debug', ['clean', 'jshint', 'fe_wget']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
