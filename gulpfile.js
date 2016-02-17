var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cryptoJS = require('crypto-js'),
    fs = require("fs"),
    del = require('del'),
    minifyHTML = require('gulp-htmlmin'),
    SCO_data = require('./src/js/sco_data.json');

gulp.task('js', function(){
  return gulp.src('src/js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('crypto', function(){
  var rawStr = JSON.stringify(SCO_data);
  var wordArray = cryptoJS.enc.Utf8.parse(rawStr);
  var base64 = cryptoJS.enc.Base64.stringify(wordArray);

  fs.writeFileSync('src/js/sco_data_enc.json', base64);
});

//Run this after the default task, and after you manually update the script tags to use the concat file
gulp.task('html-min', function(){
  return gulp.src('src/index.html')
        .pipe(minifyHTML({collapseWhitespace: true, minifyCSS: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(){
  return del(['dist']);
});

gulp.task('default', function(){
  gulp.start('js', 'html-min');
});
