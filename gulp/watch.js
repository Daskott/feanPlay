var gulp = require('gulp');
var livereload = require('gulp-livereload');

//watch src files for changes & apply them to assets & browesr
gulp.task('watch',['css','js'], function(){
    livereload({start:true});//listen for changes to update  browesr
    gulp.watch('./css/**/*.styl',['css']); //watch cs
    gulp.watch('./ng/**/*.js',['js']); //watch js
});
