const gulp             = require('gulp');
const eventStream      = require('event-stream');
const buildIndex       = require('./index');
const buildImages      = require('./images');
const buildFonts       = require('./fonts');
const buildAudio       = require('./audio');

const buildApp = function() {
  return eventStream.merge(
    buildIndex(),
    buildImages(),
    buildFonts(),
    buildAudio()
  );
};

gulp.task('build-app', ['clean'], buildApp);
module.exports = buildApp;
