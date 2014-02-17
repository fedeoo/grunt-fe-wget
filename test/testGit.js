var owner = 'mbostock';
var repoName = 'd3';
var gitdownload = require('../tasks/lib/download-github-repo.js');
gitdownload(owner + '/' + repoName, 'outputPath/' + repoName, function (err) {
    console.log('failed: download ' + repoName);
    callback();
});