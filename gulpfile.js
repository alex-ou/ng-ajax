var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    del = require('del'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;


gulp.task('scripts', function() {
    return gulp.src('src/**/*.js')
        //.pipe(jshint('.jshintrc'))
        //.pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'))
        .pipe(reload);
});

gulp.task('clean', function() {
    return del(['dist/']);
});

gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir:['demo/', 'dist/']
        }
    });
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch(['demo/*.html'], reload);
});

gulp.task('default', ['clean'], function() {
    gulp.start( 'scripts');
});
