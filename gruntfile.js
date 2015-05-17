module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            gitRepoUpdate: {
                command: [
                    'git remote update --prune',
                    'git status'
                ].join('&&'),
                options: {
                    stdout: true
                }
            }
        },
        concat: {
            dist: {
                src: [ 
                    'build/js/vendor/onmediaquery/onmediaquery.min.js', 
                    'build/js/vendor/respond/respond.js',                  
                    'build/js/global.js',
                    'build/js/vendor/modernizr/modernizr.js'
                ],
                dest: 'build/js/production.js',
            }
        },
        uglify: {
            build: {
                src: 'build/js/production.js',
                dest: 'web/assets/js/production.min.js'
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'build/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'web/assets/img/'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'build/img/', // Src matches are relative to this path.
                    src: ['**/*.svg'], // Actual pattern(s) to match.
                    dest: 'web/assets/img', // Destination path prefix.
                    ext: '.svg',
                }]
            }
        },
        sass: {
            dist: {
                options: {
                    sourceMap: true, 
                    outputStyle: 'compressed'
                },
                files: {
                    'web/assets/css/global.css': 'build/css/global.scss'
                }
            }
        },
        markdown: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'build/md_pages/',
                    src: ['**/*.md'],
                    dest: 'web/',
                    ext: '.html'
                }],
                options: {
                    template: 'build/md_pages/md_template.jst',
                }
            }
        },
        watch: {
            scripts: {
                files: ['build/js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            css: {
                files: ['build/css/**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                },
            },
            html: {
                files: ['build/md_pages/**/*.md'],
                tasks: ['markdown'],
                options: {
                    spawn: false,
                },
            },
            images: {
                files: ['build/img/**/*.{png,jpg,gif}'],
                tasks: ['newer:imagemin'],
                options: {
                    spawn: false,
                },
            },
            svg: {
                files: ['build/img/**/*.svg'],
                tasks: ['newer:svgmin'],
                options: {
                    spawn: false,
                }
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    require('load-grunt-tasks')(grunt);

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['shell', 'concat', 'uglify', 'sass', 'newer:svgmin', 'markdown', 'newer:imagemin', 'watch']);

};