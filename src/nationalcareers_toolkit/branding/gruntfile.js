module.exports = function (grunt) {


    // Project configuration.
    grunt.initConfig({
        copy: {
            dist: {
                files: [
                    { expand: true, cwd: 'node_modules/@nccsdesignlibrary/frontend/app/assets/sass', src: ['**'], dest: 'src/frontend/sass/' },
                    { expand: true, cwd: 'node_modules/@nccsdesignlibrary/frontend/app/assets/javascripts', src: ['**'], dest: 'src/frontend/javascripts/' }

                ]
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    // Task definitions
    grunt.registerTask('default', ' ', function () {
        grunt.task.run('copy');
    });
};