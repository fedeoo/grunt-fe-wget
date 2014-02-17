
// var fs = require('fs');

// var log = console.log;
// var unzip = require('unzip');
var outputPath = 'zip';
var outputFile = '../js/bootstrap-3.1.1-dist.zip';

// var extract = unzip.Extract({ path: outputPath });
// extract.on('error', function (err) {
//     log.warn(err);
// }).on('finish', function () {
//     log('zip ' + outputFile + ' ----> ' + outputPath);
// });
// fs.createReadStream(outputFile).pipe(extract);

var AdmZip = require('adm-zip');
var zip = new AdmZip(outputFile);
zip.extractAllTo(outputPath, true);
log('zip ' + outputFile + ' ----> ' + outputPath);