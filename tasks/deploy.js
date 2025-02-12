const gulp = require('gulp');

const deploy = gulp.series((done) => {
  global.production = true;
  done();
}, 'build-app');

gulp.task('deploy', deploy);
module.exports = deploy;
