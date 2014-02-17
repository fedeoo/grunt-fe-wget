'use strict';

/**
 * [parseLibs description]
 * @param  {[type]} libs [Gruntfile.js中的libs 数组]
 * @return {[type]}      [map 滤去重复 {name: obj}]
 */
exports.parseLibs = function (libs) {

    var fs = require('fs');
    // delete require.cache['./libConfig.json'];
    var libConfig = require('./libConfig.json');
    var deps = {};
    function resovleDeps (name) {
        var item = libConfig[name];
        if (deps[name] === undefined) {
            deps[name] = {
                url : item.url,
            };
            if (item.dependencies !== undefined) {
                item.dependencies.forEach(function (value) {
                    resovleDeps(value);
                });
            }
        }
    }

    libs.forEach(function (lib) {
        if (typeof lib === 'string') {
            resovleDeps(lib.toLowerCase());
        } else if (typeof lib === 'object') {
            if (typeof lib.name === 'string' && typeof lib.url === 'string') {
                var lib.name = lib.name.toLowerCase();
                deps[lib.name] = deps[lib.name] || {
                    url : lib.url,
                    dest : lib.dest
                };
            }
        }
    });
    return deps;
};

exports.forEachObj = function (obj, callback) {
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            callback(k, obj[k]);
        }
    }
};

/**
 * [objToArray 将一个map改成数组，为了使用async.forEach]
 * @param  {[type]} obj [一个对象]
 * @return {[type]}     [数组]
 */
exports.objToArray = function (obj) {
    var result = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            result.push({
                name: k,
                value: obj[k]
            });
        }
    }
    return result;
};

exports.unzip = function (outputFile, outputPath) {
    var AdmZip = require('adm-zip');
    var zip = new AdmZip(outputFile);
    zip.extractAllTo(outputPath, true);
    // log.writeln('zip ' + outputFile + ' ----> ' + outputPath);
}