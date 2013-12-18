var fs = require('fs');
var path = require('path');

var env = process.argv[2];
var input = process.argv[3];
var appRoot = path.dirname(path.resolve(__dirname, input));

if (env == 'dev') {
	var build = require('./lib/build-dev');
	var outputDir = __dirname + '/build/dev';
	var doBuild = build.bind(null, input, appRoot, outputDir);

	doBuild();

	fs.watch(appRoot, doBuild);
	fs.watch(path.join(appRoot, 'scripts'), doBuild);
	fs.watch(path.join(appRoot, 'scripts/services'), doBuild);
	fs.watch(path.join(appRoot, 'scripts/controllers'), doBuild);
	fs.watch(path.join(appRoot, 'scripts/directives'), doBuild);
} else if (env == 'prod') {
	var build = require('./lib/build-prod');
	var outputDir = __dirname + '/build/prod';
	build(input, appRoot, outputDir);
} else {
	console.error("Invalid environment %s", env);
}
