const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const serve = () => {
  browserSync.init({
    server: { baseDir: './' },
    files: ['public/**/*.*'],
    browser: process.platform === 'darwin' ? 'Google Chrome' : 'chrome',
    reloadDelay: 1000
  });
};

gulp.task('serve', serve);
module.exports = serve;
