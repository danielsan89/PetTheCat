const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass')); 
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css'); 
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const config = require('../package').gulp;

global.production = process.env.NODE_ENV === 'production';

const buildCss = () => {
  return gulp.src(`${config.src.scss}${config.main.scss}`)
    .pipe(sourcemaps.init()) 
    .pipe(sass().on('error', sass.logError)) 
    .pipe(autoprefixer({ browsers: ['last 2 versions'] })) 
    .pipe(concat(config.output.css))
    .pipe(gulpIf(global.production, cleanCSS()))
    .pipe(gulpIf(global.production, rename({ suffix: '.min' })))
    .pipe(sourcemaps.write('.')) 
    .pipe(gulp.dest(config.dest.css))
    .pipe(gulpIf(!global.production, browserSync.stream()));
};

gulp.task('build-css', buildCss);
module.exports = buildCss;
