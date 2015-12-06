"use strict";

module.exports = function (grunt) {
    // Load multiple grunt tasks using globbing patterns
    // https://www.npmjs.com/package/load-grunt-tasks
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });

    // Display the elapsed execution time of grunt tasks
    // https://www.npmjs.com/package/time-grunt
    require('time-grunt')(grunt);

    // project configuration
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*! <%%= pkg.name %> - v<%%= pkg.version %>\n' +
        '* Copyright (c) <%%= pkg.author.name %>;\n' +
        '*/\n\n',

        resourcePath: '<%= srcpath %>',
        distPath: '<%= distpath %>',
        webRootPath: '<%= webrootpath %>',

        // Clean files and folders
        // https://www.npmjs.com/package/grunt-contrib-clean
        clean: {
            options: {
                force: true
            },
            main: [
                "<%%= distPath %>",
                "<%%= webRootPath %>/*.html"<% if(stylesheet == "less"){ %>,
                "<%%= resourcePath %>/css/buildbyless/**/*.css"<%}%>
            ]
        },

        // Copy files and folders
        // https://www.npmjs.com/package/grunt-contrib-copy
        copy: {
            img: {
                files: [{
                    expand: true,
                    cwd: '<%%= resourcePath %>/img/',
                    src: ['**/*'],
                    dest: '<%%= distPath %>/img/'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: <% if(usebower){ %>'<%%= resourcePath %>/bower_components/jquery/dist/'<%}else{%>'<%%= resourcePath %>/js/lib/'<%}%>,
                    src: ['jquery*.js'],
                    dest: '<%%= distPath %>/js/lib/'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: '<%%= resourcePath %>/html/',
                    src: ['**/*.html'],
                    dest: '<%%= webRootPath %>'
                }]
            }
        },<% if(stylesheet == "less"){ %>

        // Compile LESS files to CSS
        // https://www.npmjs.com/package/grunt-contrib-less
        less: {
            main: {
                files: [{
                    expand: true,
                    cwd: "<%%= resourcePath %>/less/",
                    src: ["**/*.less"],
                    dest: "<%%= resourcePath %>/css/buildbyless/",
                    ext: ".css"
                }]
            }
        },<%}%>

        // Concatenate files
        // https://www.npmjs.com/package/grunt-contrib-concat
        concat: {
            options: {
                banner: "<%%= banner %>"
            },
            js: {
                options: {
                    separator: ';\n'
                },
                files: {
                    '<%%= distPath %>/js/all.js': [
                        '<%%= resourcePath %>/js/core/util.js',
                        '<%%= resourcePath %>/js/widget/loading.js',
                        '<%%= resourcePath %>/js/page/index.js'
                    ]
                }
            },
            css: {
                files: {
                    '<%%= distPath %>/css/all.css': [
                        '<%%= resourcePath %>/css/normalize.css',
                        '<%%= resourcePath %>/css/other.css',<% if(stylesheet == "less"){ %>
                        '<%%= resourcePath %>/css/buildbyless/common.css',
                        '<%%= resourcePath %>/css/buildbyless/widget.css',
                        '<%%= resourcePath %>/css/buildbyless/page.css' <%}%>
                    ]
                }
            }
        },

        // Validate files with JSHint
        // https://www.npmjs.com/package/grunt-contrib-jshint
        jshint: {
            all: [
                '<%%= resourcePath %>/js/**/*.js'<% if(!usebower){ %>,
                '!<%%= resourcePath %>/js/lib/*.js'<% } %>
            ]
        },

        // Minify files with UglifyJS
        // https://www.npmjs.com/package/grunt-contrib-uglify
        uglify: {
            options: {
                banner: "<%%= banner %>"
            },
            main: {
                files: [{
                    expand: true,
                    cwd: '<%%= distPath %>/js/',
                    src: ['*.js'],
                    dest: '<%%= distPath %>/js/',
                    ext: ".min.js"
                }]
            }
        },

        // Minify CSS
        // https://www.npmjs.com/package/grunt-contrib-cssmin
        cssmin: {
            options: {
                banner: "<%%= banner %>"
            },
            main: {
                files: [{
                    expand: true,
                    cwd: '<%%= distPath %>/css/',
                    src: ['*.css'],
                    dest: '<%%= distPath %>/css/',
                    ext: ".min.css"
                }]
            }
        },

        // Minify HTML
        // https://www.npmjs.com/package/grunt-contrib-htmlmin
        htmlmin: {
            main: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: [{
                    expand: true,
                    cwd: '<%%= webRootPath %>',
                    src: ['*.html'],
                    dest: '<%%= webRootPath %>'
                }]
            }
        },

        // Minify images
        // https://www.npmjs.com/package/grunt-contrib-imagemin
        imagemin: {
            main: {
                files: [{
                    expand: true,
                    cwd: '<%%= distPath %>/img/',
                    src: ['**/*.{png,jpg,jpeg}'],
                    dest: '<%%= distPath %>/img/'
                }]
            }
        },

        // deal with js or css link in html
        // https://www.npmjs.com/package/grunt-htmlstamp
        htmlstamp: {
            dev: {
                files: {
                    '<%%= webRootPath %>/index.html': [
                        '<%%= distPath %>/js/**/*.js',
                        '!<%%= distPath %>/js/lib/*.js',
                        '<%%= distPath %>/css/**/*.css'
                    ]
                }
            },
            deployJs: {
                options: {
                    type: '<%=jsdeploy%>',
                    appendType: 'hash'
                },
                files: {
                    '<%%= webRootPath %>/index.html': [
                        '<%%= distPath %>/js/**/*.js',
                        '!<%%= distPath %>/js/lib/*.js'
                    ]
                }
            },
            deployCss: {
                options: {
                    type: '<%=cssdeploy%>',
                    appendType: 'hash'
                },
                files: {
                    '<%%= webRootPath %>/index.html': [
                        '<%%= distPath %>/css/**/*.css'
                    ]
                }
            }
        },

        // modify file content
        // https://www.npmjs.com/package/grunt-file-modify
        file_modify: {
            removeDebug: {
                options: {
                    reg: {
                        /**
                         * remove line which including “//@debug”
                         * console.log(s1); // @debug remove this line!
                         */
                        pattern: '[^\\n]+\\/\\/\\s*@\\s*debug.*'
                    }
                },
                src: ['<%%= distPath %>/js/all.js']
            }
        },

        // Start a connect web server
        // https://www.npmjs.com/package/grunt-contrib-connect
        connect: {
            options: {
                port: 8000,
                hostname: 'localhost',
                base: '<%%= webRootPath %>'
            },
            livereload: {
                options: {
                    middleware: function (connect, options, middlewares) {
                        /**
                         * Inject a live reload script tag into your page using connect-livereload.
                         * Example: <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
                         */
                        var lrSnippet = require('connect-livereload')({
                            port: grunt.config.get('watch').client.options.livereload
                        });
                        middlewares.unshift(lrSnippet);
                        return middlewares;
                    }
                }
            }
        },

        // Run predefined tasks whenever watched file patterns are added, changed or deleted
        // https://www.npmjs.com/package/grunt-contrib-watch
        watch: {
            js: {
                files: ['<%%= resourcePath %>/js/**/*.js'],
                tasks: ['jshint', 'concat:js', 'copy:html', 'htmlstamp:dev']
            },
            css: {
                files: ['<%%= resourcePath %>/css/**/*.css'],
                tasks: ['concat:css', 'copy:html', 'htmlstamp:dev']
            },<% if(stylesheet == "less"){ %>
            less: {
                files: ['<%%= resourcePath %>/less/**/*.less'],
                tasks: ['less']
            },<%}%>
            image: {
                files: ['<%%= resourcePath %>/img/**/*'],
                tasks: ['copy:img', 'imagemin']
            },
            html: {
                files: ['<%%= resourcePath %>/html/**/*.html'],
                tasks: ['copy:html', 'htmlstamp:dev']
            },
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            },
            client: {
                options: {
                    livereload: 35729 // default: 35729
                },
                files: ['<%%= connect.options.base || "." %>/*.html']
            }
        }

    });

    // Live-reload task
    grunt.registerTask('live', [
        'connect',
        'watch'
    ]);

    // Develop task
    grunt.registerTask('dev', [
        'clean:main',
        'jshint',
        'concat:js',
        'copy:js',<% if(stylesheet == "less"){ %>
        'less',<%}%>
        'concat:css',
        'copy:img',
        'copy:html',
        'htmlstamp:dev'
    ]);

    // Default task. Using it to write code with live-reload!
    grunt.registerTask('default', [
        'dev',
        'live'
    ]);

    // Deploy task
    grunt.registerTask('deploy', [
        'clean:main',
        'jshint',
        'concat:js',
        'file_modify:removeDebug',
        'copy:js',
        'uglify',<% if(stylesheet == "less"){ %>
        'less',<%}%>
        'concat:css',
        'cssmin',
        'copy:img',
        'imagemin',
        'copy:html',
        'htmlstamp:deployJs',
        'htmlstamp:deployCss',
        'htmlmin'
    ]);
};
