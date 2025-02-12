const gulp = require('gulp');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const config = require('../package').gulp;

const cleanImages = () => {
  return gulp.src(config.dest.images, { read: false, allowEmpty: true })
    .pipe(clean());
};

const copyImages = () => {
  return gulp.src(`${config.src.images}${config.selectors.images}`)
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.gifsicle({ interlaced: true })
    ]))
    .pipe(gulp.dest(config.dest.images))
    .pipe(browserSync.stream());
};

const buildImages = gulp.series(cleanImages, copyImages);

gulp.task('build-images', buildImages);
module.exports = buildImages;
