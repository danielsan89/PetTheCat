require('./serve'); 
require('./watch'); 
const gulp = require('gulp');

const defaultTask = gulp.parallel('serve', 'watch');

gulp.task('default', defaultTask);
module.exports = defaultTask;
