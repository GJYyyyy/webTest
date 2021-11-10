'use strict';

var gulp = require('gulp');

gulp.paths = {
    dist : 'build',
    src: 'apps/scripts',
    cpnt: 'apps/components'
};

var plugins = require('gulp-load-plugins')({
    pattern : [ 'gulp-*', 'del' ]
});

gulp.task('clean', function(cb) {
    plugins.del([ gulp.paths.dist + '/common*.js', gulp.paths.dist + '/ca-plug*.js']).then(function() {
        cb();
    });
});

gulp.task('concatJs',[ 'clean' ], function() {
    return gulp.src([ gulp.paths.cpnt + '/**/*.js',gulp.paths.src + '/*.js'])
        .pipe(plugins.concat('common-front.js'))
        .pipe(gulp.dest(gulp.paths.dist + '/'));
});

gulp.task('minifyJs', [ 'concatJs' ], function() {
    gulp.src(gulp.paths.dist + '/common-front.js')
        .pipe(plugins.uglify())
        .pipe(plugins.rename('common-front.min.js'))
        .pipe(gulp.dest(gulp.paths.dist + '/'));
});
gulp.task('concatCa', function() {
    return gulp.src([gulp.paths.src + '/CA-plugin/*.js'])
        .pipe(plugins.concat('ca-plugin.js'))
        .pipe(gulp.dest(gulp.paths.dist + '/'));
});


gulp.task('default', function() {
    gulp.start('concatCa');
    gulp.start('minifyJs');
});