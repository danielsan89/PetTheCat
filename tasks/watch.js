const gulp = require('gulp');
const config = require('../package').gulp;

const watch = () => {
  gulp.watch(`${config.src.scss}${config.selectors.scss}`, gulp.series('build-css'));
  gulp.watch(`${config.src.js}${config.selectors.js}`, gulp.series('build-js'));
  gulp.watch(`${config.src.images}${config.selectors.images}`, gulp.series('build-images'));
  gulp.watch(`${config.src.audio}${config.selectors.audio}`, gulp.series('build-audio'));
  gulp.watch(`${config.srcDir}${config.main.index}`, gulp.series('build-index'));
};

gulp.task('watch', watch);
module.exports = watch;
