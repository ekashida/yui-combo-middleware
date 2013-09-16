module.exports = function (grunt) {
    var cwd = process.cwd();

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: cwd + '/node_modules/yui-lint/jshint.json'
            },
            all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
};
