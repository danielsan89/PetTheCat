const gulp = require('gulp');
const clean = require('gulp-clean');
const config = require('../package').gulp;

const cleanDest = () => {
  return gulp.src(config.destDir, { read: false, allowEmpty: true })
    .pipe(clean());
};

gulp.task('clean', cleanDest);

module.exports = cleanDest;
