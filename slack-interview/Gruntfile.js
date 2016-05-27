module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        sass: {
          dist: {
            files: {
              'main.css': 'main.scss'
            }
          }
        },
        watch: {
          scripts: {
            files: 'main.scss',
            tasks: 'sass',
            options: {
              spawn: false,
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.registerTask('default', ['sass']);
}