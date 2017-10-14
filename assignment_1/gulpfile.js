var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css'); 
var sourcemaps = require('gulp-sourcemaps');

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(concat('concat.js'))
        .pipe(rename('form.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

// Compile Sass
gulp.task('style', function() {
    return gulp.src('src/css/*css')
        .pipe(rename('style.min.css'))
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['style', 'scripts']);