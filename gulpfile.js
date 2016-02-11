var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cryptoJS = require('crypto-js'),
    fs = require("fs"),
    SCO_data = require('./src/js/sco_data.js');
    /*
    minifycss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),
    del = require('del');
    */

gulp.task('js', function(){
  return gulp.src(['src/js/main.js', 'src/js/SCORM_2004_APIWrapper.js'])
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('html-copy', function(){
  return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('crypto', function(){
  var rawStr = JSON.stringify(SCO_data);
  var wordArray = cryptoJS.enc.Utf8.parse(rawStr);
  var base64 = cryptoJS.enc.Base64.stringify(wordArray);
  console.log('encrypted:', base64);
});

//Run this after the default task, and after you manually update the script tags to use the concat file
/*gulp.task('html-min', function(){
  return gulp.src('dist/*.html')
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(){
  return del(['dist']);
});*/

gulp.task('default', function(){
  gulp.start('js', 'html-copy');
});
