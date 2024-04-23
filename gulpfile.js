const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

gulp.task('optimizeImages', function() {
  return gulp.src('src/images/*.png')
    .pipe(gulp.dest('dist/images'));
});


gulp.task('minifyCSS', function() {
  return gulp.src('src/css/**/*.css')
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('minifyJS', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});


gulp.task('minifyHTML', function() {
  return gulp.src('src/index.html')
    .pipe(replace('./css/styles.css', './css/styles.min.css'))
    .pipe(replace('./js/main.js', './js/script.min.js'))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

// Задача сборки проекта
gulp.task('build', gulp.parallel('minifyCSS', 'minifyJS', 'optimizeImages', 'minifyHTML'));

// Задача по умолчанию
gulp.task('default', gulp.series('build'));
