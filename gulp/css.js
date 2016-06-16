
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var concatCss = require('gulp-concat-css');
var livereload = require('gulp-livereload');


//preprocess style sheet
gulp.task('css', function(){
  gulp.src(['./css/**/*.styl'])
  .pipe(stylus())
  .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
  .pipe(gulp.dest('assets'))
  .pipe(livereload());
});

//preprocess style sheet
gulp.task('vendor-css', function(){
  gulp.src(['./vendor/css/ng-tags-input.min.css','./vendor/css/*.css'])
  .pipe(concatCss('vendor.css'))
  .pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
  .pipe(gulp.dest('assets'))
  .pipe(livereload());
});
