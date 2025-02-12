const gulp = require('gulp');
const buildIndex = require('./index');
const buildImages = require('./images');
const buildFonts = require('./fonts');
const buildAudio = require('./audio');

const buildApp = gulp.series(
  'clean',
  gulp.parallel(buildIndex, buildImages, buildFonts, buildAudio)
);

gulp.task('build-app', buildApp);

module.exports = buildApp;
