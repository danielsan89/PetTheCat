const gulp = require('gulp');
const gulpIf = require('gulp-if');
const htmlhint = require('gulp-htmlhint');
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');
const browserSync = require('browser-sync').create();
const config = require('../package').gulp;

const validateIndex = () => {
  return gulp.src(`${config.srcDir}${config.main.index}`)
    .pipe(htmlhint({ 'doctype-first': false }))
    .pipe(htmlhint.reporter());
};

const buildIndex = () => {
  const jsStream = gulp.src(`${config.dest.js}${config.output.js}`);
  const cssStream = gulp.src(`${config.dest.css}${config.output.css}`);

  return gulp.src(`${config.srcDir}${config.main.index}`)
    .pipe(validateIndex()) 
    .pipe(gulp.dest('./')) 
    .pipe(gulpIf(!global.production, inject(jsStream, { relative: true, addRootSlash: true })))
    .pipe(gulpIf(!global.production, inject(cssStream, { relative: true, addRootSlash: true })))
    .pipe(gulpIf(global.production, inject(jsStream, { relative: false, addRootSlash: true })))
    .pipe(gulpIf(global.production, inject(cssStream, { relative: false, addRootSlash: true })))
    .pipe(gulpIf(global.production, htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest('./'))
    .pipe(gulpIf(!global.production, browserSync.stream()));
};

gulp.task('build-index', buildIndex);
module.exports = buildIndex;
