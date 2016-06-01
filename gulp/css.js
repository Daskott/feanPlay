
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var livereload = require('gulp-livereload');


//preprocess style sheet
gulp.task('css', function(){
  gulp.src(['./css/**/*.styl'])
  .pipe(stylus())
  .pipe(gulp.dest('assets'))
  .pipe(livereload());
});
