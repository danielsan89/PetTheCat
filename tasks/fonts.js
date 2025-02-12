const gulp = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const config = require('../package').gulp;

const cleanFonts = () => {
  return gulp.src(config.dest.fonts, { read: false, allowEmpty: true }) 
    .pipe(clean());
};

const copyFonts = () => {
  return gulp.src(`${config.src.fonts}${config.selectors.fonts}`)
    .pipe(gulp.dest(config.dest.fonts))
    .pipe(browserSync.stream());
};

const buildFonts = gulp.series(cleanFonts, copyFonts);

gulp.task('build-fonts', buildFonts);
module.exports = buildFonts;
