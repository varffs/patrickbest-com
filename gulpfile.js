var gulp = require('gulp');

var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var   util = require('gulp-util');
var notify = require('gulp-notify');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var swiss = require('kouto-swiss');

function errorNotify(error){
  notify.onError("Error: <%= error.message %>");
  util.log(util.colors.red('Error'), error.message);
}

gulp.task('stylus', function() {
  return gulp.src('src/site.styl')
  .pipe(plumber())
  .pipe(stylus({
    use: [
      swiss()
    ],
  }))
  .on('error', errorNotify)
  .pipe(autoprefixer({
    browsers: ['last 3 versions'],
  }))
  .on('error', errorNotify)
  .pipe(gulp.dest('dist/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(cleanCSS())
  .on('error', errorNotify)
  .pipe(gulp.dest('dist/css'))
  .pipe(notify({ message: 'Style task complete' }));
});

gulp.watch(['src/site.styl'], ['stylus']);

// watch files for changes and reload
gulp.task('serve', ['stylus'], function() {
  browserSync({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(['*.html', 'dist/**/*.*'], {}, reload);
});

gulp.task('build', ['stylus']);

gulp.task('default', ['serve', 'build']);
