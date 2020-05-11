const gulp = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-clean-css');

gulp.task('styles', () => {
    return gulp.src('./styles/views/*.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest('./views/static/styles'));
});

gulp.task('watch', () => {
    gulp.watch('./styles/**/*.less',gulp.series('styles'));
});