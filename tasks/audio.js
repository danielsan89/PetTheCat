const gulp = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const config = require('../package').gulp;

const cleanAudio = () => {
  return gulp.src(config.dest.audio, { read: false, allowEmpty: true }) 
    .pipe(clean());
};

const copyAudio = () => {
  return gulp.src(`${config.src.audio}${config.selectors.audio}`)
    .pipe(gulp.dest(config.dest.audio))
    .pipe(browserSync.stream());
};

const buildAudio = gulp.series(cleanAudio, copyAudio);

gulp.task('build-audio', buildAudio);

module.exports = buildAudio;
