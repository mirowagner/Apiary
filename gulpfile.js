var gulp          = require('gulp'),
    plumber       = require('gulp-plumber'),
	  sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
	  autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    deploy        = require('gulp-gh-pages'),
    uglify        = require('gulp-uglify'),
    browserSync   = require('browser-sync').create();



var paths = {
  src:    './src/',
  dest:   './build/',
  bower:  './bower_components/',
  js:     './src/js/',
  sass:   './src/sass/',
  pages:  './src/pages/'
};



// Copy assets
gulp.task('copy', function() {
  return gulp.src([
    paths.pages + '**/*',
    paths.bower + 'vue/dist/vue.min.js'
  ])
    .pipe(gulp.dest(paths.dest));
});



gulp.task('js', function() {
  return gulp.src([
    paths.js + 'utils.js',
    paths.js + 'wordlist.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest(paths.dest));
});



// Compile Sass; Autoprefix; map source
gulp.task('sass', function() {
  return gulp.src(paths.sass + '**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
      .on('error', sass.logError)
    .pipe(autoprefixer({browsers: 'last 1 versions'}))
    .pipe(sourcemaps.write('sourcemaps'))
    .pipe(gulp.dest(paths.dest));
});



// Watch for changes to source files
gulp.task('watch', function() {
  gulp.watch([paths.js + '**/*'],      ['js']);
  gulp.watch([paths.sass + '**/*'],    ['sass']);
  gulp.watch([paths.pages + '**/*' ],  ['copy']);
});



// Serve and watch
gulp.task('serve', function() {
  browserSync.init({
    server:  paths.dest,
    files:   [paths.dest + '*'],
    notify:  false,
    open:    false
  });
});



// Default task
gulp.task('default', ['js', 'sass', 'copy', 'watch', 'serve']);



// Deploy to GitHub pages
gulp.task('deploy', ['js', 'sass', 'copy'], function() {
    return gulp.src(paths.build + '**/*')
    .pipe(deploy());
});
