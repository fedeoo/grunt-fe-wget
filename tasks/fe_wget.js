/*
 * grunt-fe-wget
 * https://github.com/fedeoo/grunt-fe-wget
 *
 * Copyright (c) 2014 fedeoo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var async = require('async');
    var fs = require('fs');
    var path = require('path');
    var url = require('url');

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('fe_wget', 'get common package for front-end', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            dest: './',
            separator: ', '
        });
        // debugger;
        var done  = this.async();
        var log = grunt.log;
        var libs = {};

        var util = require('./lib/util.js');
        
        if ( Array.isArray(this.data) ) {
            libs = util.parseLibs(this.data);
        }

        async.forEach(util.objToArray(libs), function (item, callback) {
            var name  = item.name;
            var lib  = item.value;
            log.writeln(name + ' : ' + lib.url);
            var outputPath = url.dest || options.dest;
            var libURL = lib.url;
            distributeURL(libURL, outputPath, callback);
        }, function (err) {
            if (err) {
                grunt.fail.warn(err);
            }
            done();
        });

        function distributeURL (libURL, outputPath, callback) {
            if (isGitRepo(libURL)) {
                wgetGitRepo (libURL, outputPath, callback);
            } else if (/(\w+\.\w+)$/.test(libURL)) { //*.js *.css文件
                var fileName = libURL.match(/([^\/]*)$/)[0];
                grunt.file.mkdir(outputPath);
                downloadFile(libURL, outputPath + '/' + fileName, callback, outputPath);
            } else {
                log.writeln('none match !!' + libURL);
            }
        }

        function isGitRepo (libURL) {
            var regex = /^https:\/\/github\.com\/[^\/]+\/[^\/\.]+$/i;
            return regex.test(libURL);
        }

        function wgetGitRepo (libURL, outputPath, callback) {
            var gitdownload =  require('./lib/download-github-repo');
            var match = libURL.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/\.]+)$/i);
            var owner = match[1];
            var repoName = match[2];
            if (grunt.file.exists(outputPath + '/' + repoName)) {
                return ;
            }
            gitdownload(owner + '/' + repoName, outputPath + '/' + repoName, function (err) {
                if (err) {
                    log.warn(err);
                    log.warn('failed: download ' + libURL);
                }
                callback();
            });
        }

        function downloadFile (libURL, outputFile, callback, outputPath) {
            if (grunt.file.exists(outputFile)) {
                return ;
            }
            var srcUrl = url.parse(libURL);
            require(srcUrl.protocol === 'https:' ? 'https' : 'http').get(libURL, function (res) {
                if (res.statusCode === 200) {
                    log.writeln('downloading ' + libURL + ' ----> ' + outputFile);
                    res.pipe(fs.createWriteStream(outputFile));
                    res.on('end', function () {
                        if (/\.zip$/i.test(outputFile)) {
                            util.unzip(outputFile, outputPath);
                        }
                        callback();
                    });
                } else if (res.statusCode === 302) {
                    return downloadFile(res.headers.location, outputFile, callback, outputPath);
                } else {
                    return callback(new Error(res.statusCode + ' ' + libURL));
                }
            });
        }
    });

};
