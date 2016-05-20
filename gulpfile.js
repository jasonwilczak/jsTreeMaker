var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var concat = require('gulp-concat');


gulp.task('tests',function(){
    gutil.log('Executing tests...');
});
gulp.task('cleanRelease',function(){
    gutil.log('Cleaning up release...');
    return gulp.src('./release/*.*',{read:false})
    .pipe(clean());
});
gulp.task('release',['tests','cleanRelease'],function(){
    gutil.log('Transpiling and Compressing...');
    gulp.src('./dev/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
			presets: ['es2015']
		}))
    .pipe(concat('jsTreeMaker.js'))
    .pipe(uglify())
    .pipe(rename({extname:'.min.js'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./release'));
});
