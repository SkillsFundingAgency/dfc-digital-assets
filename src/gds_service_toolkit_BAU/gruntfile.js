//'use strict';
//var path = require('path');

// match one level down:
// e.g. 'bar/foo/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// e.g. 'bar/foo/**/*.js'

module.exports = function (grunt) {
    'use strict';

    // Project assets
    // Loads project js files which will be concatenated and minified in one file
    var projectJsfiles = grunt.file.readJSON('jsfiles.json').concatCustomJsFiles;
    var govukJsfiles = grunt.file.readJSON('jsfiles.json').concatGovUkJsFiles;
    var jqueryBundle = grunt.file.readJSON('jsfiles.json').jqueryBundle;

    // Name of the folder that contains project specific assets (scss, js, images, etc.)
    var projectAssetsFolder = "frontend";

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load concat CSS
    grunt.loadNpmTasks('grunt-concat-css');

    // Init
    grunt.initConfig({
        timestamp: '<%= new Date().getTime() %>',
        pkg: grunt.file.readJSON('package.json'),

        src: {
            path: 'assets/src',
            sass: '**/*.{scss,css}',
            css: '**/*.{css}'
        },

        dist: {
            path: 'assets/dist'
        },

        concat_css: {
            all: {
                src: '<%= src.path %>/' + projectAssetsFolder + '/css/*.css',
                dest: '<%= dist.path %>/css/sfa.css'
            },
            ie8: {
                src: '<%= src.path %>/' + projectAssetsFolder + '/css/ie8/*.css',
                dest: '<%= dist.path %>/css/sfa-ie8.css'
            }
        },

        // Clean all generated files
        clean: {
            all: {
                files: [{
                    src: [
                        '<%= dist.path %>/**/*.css',
                        '<%= dist.path %>/**/*.js',
                        '<%= dist.path %>/**/*.{png,jpg,gif,jpeg}'
                    ]
                }]
            },
            css: {
                files: [{
                    src: [
                        '<%= dist.path %>/**/*.css',
                    ]
                }]
            },
            images: {
                files: [{
                    src: [
                        '<%= dist.path %>/**/*.{png,jpg,gif,jpeg}'
                    ]
                }]
            }
        },

        sass: {
            options: {
                outputStyle: 'nested',
                includePaths: [

                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= src.path %>/' + projectAssetsFolder + '/sass',
                    src: ['*.scss'],
                    dest: '<%= dist.path %>/css/',
                    ext: '.css'
                },

                    {
                        expand: true,
                        cwd: 'node_modules/govuk-frontend/',
                        src: ['*.scss'],
                        dest: '<%= dist.path %>/css/',
                        ext: '.css'
                    }]

            }
        },

        cssmin: {
            options: {
                level: 2,
            },
            target: {
                expand: true,
                cwd: '<%= dist.path %>/css/',
                src: ['*.css', '!*.min.css'],
                dest: '<%= dist.path %>/css/',
                ext: '.min.css',
                extDot: 'last'
            },
        },

        copy: {
            dist: {
                files: [
                    { expand: true, cwd: 'node_modules/govuk-frontend/assets/fonts', src: '**', dest: '<%= dist.path %>/fonts/' },
                    { expand: true, cwd: 'node_modules/govuk-frontend/assets/images', src: ['**/*.{png,jpg,gif,jpeg,svg,ico}', '!fonts/*', '!sprite/*.*'], dest: '<%= dist.path %>/images' },
                    { expand: true, cwd: 'node_modules/jquery/dist', src: 'jquery.min.js', dest: '<%= dist.path %>/js' },
                    //{ expand: true, cwd: '<%= src.path %>/' + projectAssetsFolder + '/css/', src: '**/*.*', dest: '<%= dist.path %>/css/' },
                    { expand: true, cwd: '../../Content/', src: '**/*.*', dest: '<%= dist.path %>/css/' }
                ]
            }
        },

        // Concatenates & minifies js files
        // Processes the files described in 'jsfiles.json' + bootstrap.js
        uglify: {
            options: {
                report: 'gzip',
                warnings: true,
                ie8: true,
                mangle: {
                    reserved: ['jQuery', 'Modernizr', 'selectivizr']
                },
                compress: true
            },
            dist: {
                files: [
                    // Project assets
                    // Concatenates project files listed in jsfiles.json
                    { '<%= dist.path %>/js/dfcdigital.min.js': projectJsfiles },
                    { '<%= dist.path %>/js/all.min.js': govukJsfiles },
                    { '<%= dist.path %>/js/jquerybundle.min.js': jqueryBundle },
                    {
                        expand: true,
                        src: ['*.js'],
                        dest: '<%= dist.path %>/js',
                        cwd: '<%= dist.path %>/js',
                        rename: function (dst, src) {
                            // To keep the source js files and make new files as `*.min.js`:
                            return dst + '/' + src.replace('.js', '.min.js');
                            // Or to override to src:
                            //return src;
                        }
                    }
                ]
            }
        },

        // Image Optimization
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 4,
                    progressive: true
                },
                files: [
                    { expand: true, cwd: '<%= src.path %>/sitefinity/images', src: ['**/*.{png,jpg,gif,jpeg,svg}', '!fonts/*', '!sprite/*.*'], dest: 'assets/dist/images' },
                    { expand: true, cwd: '<%= src.path %>/' + projectAssetsFolder + '/images', src: ['**/*.{png,jpg,gif,jpeg,svg}', '!fonts/*', '!sprite/*.*'], dest: 'assets/dist/images' }
                ]
            }
        },

        watch: {
            options: {
                spawn: false
            },
            styles: {
                files: ['<%= src.path %>/**/*.{scss,css}'],
                tasks: ['sass', 'cssmin']
            },
            images: {
                files: ['<%= src.path %>/**/*.{png,jpg,gif,jpeg}'],
                tasks: ['clean:images', 'sprite', 'imagemin']
            },
            js: {
                files: ['<%= src.path %>/**/*.js'],
                tasks: ['uglify']
            }
        },

        concurrent: {
            dist: {
                tasks: ['watch:styles', 'watch:js', 'watch:images'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // Default task
    grunt.registerTask('default', ' ', function () {
        grunt.task.run('clean:all');
        grunt.task.run('copy');
        grunt.task.run('uglify');
        grunt.task.run('sass');
        grunt.task.run('concat_css');
        grunt.task.run('cssmin');
        grunt.task.run('newer:imagemin');
        //grunt.task.run('concurrent'); we dont want to block the release pipeline
    });
};
