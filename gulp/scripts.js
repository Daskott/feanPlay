var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');


/*
* gulp.scr -> get all ng-js files in 'ng'
* concat -> concat them[make sure module.js comes 1st]
* ngAnnotate -> rewrite file to make it compatible with minification
* uglify -> minify them
* sourcemaps -> create a source map to minified file,
*               so you can know where things happen [for debugging]
* gulp.dest-> then save output in 'assets/app.js'
*/
gulp.task('js', function(){
  gulp.src(['./ng/firebase.js','./ng/module.js','./ng/**/*.js'])
  //.pipe(sourcemaps.init())
  .pipe(concat('app.js'))
  .pipe(ngAnnotate())
  .pipe(uglify())
  //.pipe(sourcemaps.write())
  .pipe(gulp.dest('public/assets'))
  .pipe(livereload());
});
