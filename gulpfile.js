var gulp = require("gulp");
var include = require('gulp-html-tag-include');
var runSequence = require('run-sequence');
var rename = require("gulp-rename");

/*
gulp.task('lib', function () {
  return gulp.src('lib/**')
    .pipe(gulp.dest('./dist/lib'))
});

gulp.task('src', function () {
  return gulp.src(['navbar-top-fixed.css', 'basic.ico', 'logo-ortolang-white.png'])
    .pipe(gulp.dest('./dist'))
});
*/

gulp.task('basic', function () {
  // construct index.html
   return gulp.src(['./basic-fr.html', './basic-en.html', './body-french.html', './body-english.html'])
       .pipe(include())
       .pipe(gulp.dest('./temp'));
});

gulp.task('index-en', function () {
  return gulp.src('./temp/basic-en.html')
    .pipe(rename('./index-en.html'))
    .pipe(gulp.dest('.'));
});

gulp.task('index-fr', function () {
    return gulp.src('./temp/basic-fr.html')
      .pipe(rename('./index-fr.html'))
      .pipe(gulp.dest('.'));
  });
  
gulp.task('all', gulp.series('basic', 'index-fr', 'index-en'));
