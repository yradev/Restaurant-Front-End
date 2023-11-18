// gulpfile.js

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const globImporter = require('sass-glob-importer');

gulp.task('style', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(sass({ importer: globImporter() }))
    .pipe(gulp.dest('./public/assets/css'));
});


// Watch for changes and recompile Sass
gulp.task('watch', function() {
  gulp.watch('./src/scss/main.scss', gulp.series('style'));
  gulp.watch('./src/scss/components/*', gulp.series('style'));
  gulp.watch('./src/scss/core/*', gulp.series('style'));
});

// Default task
gulp.task('default', gulp.series('style', 'watch'));
