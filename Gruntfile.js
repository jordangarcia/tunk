function negate(item) {
	return '!' + item;
}
var cwd = 'app/';
var sassFiles = ['styles/*.scss', 'styles/**/*.scss'];
// take all files in working dir and one level down and concat the negations to jade and sass files
var assetFiles = ['*', '**/*'].concat(sassFiles.map(negate));
var devDir = 'build/dev/';
var devPort = 8001;

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dev: [devDir],
		},
		copy: {
			dev: {
				files: [{
					expand: true,
					cwd: cwd,
					src: assetFiles,
					dest: devDir
				}]
			}
		},
		connect: {
			dev: {
				options: {
					hostname: '0.0.0.0',
					port: devPort,
					keepalive: true,
					base: devDir
				}
			}
		},
		sass: {
			dev: {
				files: [{
					expand: true,
					cwd: cwd,
					src: sassFiles,
					dest: devDir,
					ext: '.css'
				}]
			}
		},
		watch: {
			options: {
				cwd: cwd,
				spawn: true
			},
			assets: {
				files: assetFiles,
				tasks: ['copy:dev']
			},
			sass: {
				files: sassFiles,
				tasks: ['sass:dev']
			}
		},
		concurrent: {
			dev: ['connect:dev', 'watch:assets', 'watch:sass']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('init:dev', ['clean:dev', 'copy:dev', 'sass:dev'])
	grunt.registerTask('start:dev', ['init:dev', 'concurrent:dev']);
};
