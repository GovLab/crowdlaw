var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var shell = require('gulp-shell');
var runSequence     = require('run-sequence').use(gulp);
var browserSync = require('browser-sync').create();
var replace = require('gulp-replace');
const yaml = require('gulp-yaml');

// Task for building blog when something changed:
// gulp.task('build', shell.task(['bundle exec jekyll build --watch']));
// Or if you don't use bundle:
gulp.task('build', shell.task(['jekyll build --watch']));

// Task for serving blog with Browsersync
gulp.task('serve', function () {
  browserSync.init({server: {baseDir: '_site/'}});
    // Reloads page when some of the already built files changed:
    gulp.watch('_site/**/*.*').on('change', browserSync.reload);
  });

gulp.task('yaml', function () {
  return gulp.src('./_data/**/*.yaml')
  .pipe(replace(/!ruby\/object.*/g, ''))
  .pipe(yaml())
  .pipe(gulp.dest('./json/'))
});

gulp.task('push-gh-master', shell.task(['git push origin master']));

gulp.task('push-gh-pages', function () {
  return gulp.src('./_site/**/*')
  .pipe(ghPages({ force: true }));
});

gulp.task('deploy', function (callback) {
  runSequence(
    'push-gh-master',
    'push-gh-pages',
    callback
    );
});

gulp.task('default', ['build', 'serve']);