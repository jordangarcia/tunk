module.exports = function(config) { 
	config.set({
		basePath: '..',
		frameworks: ['jasmine'],
		files: [
			'app/bower_components/angular/angular.js',
			'app/bower_components/angular-sanitize/angular-sanitize.js',
			'app/bower_components/underscore/underscore.js',
			'app/bower_components/angular-mocks/angular-mocks.js',
			'app/scripts/app.js',
			'app/scripts/**/*.js',
			'test/specs/**/*Spec.js'
		],
		reporters: ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_DEBUG,
		browsers: ['Chrome'],
		captureTimeout: 10000,
		autoWatch: true,
		singleRun: false,
	});
};
