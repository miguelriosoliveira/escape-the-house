const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

gulp.task('default', () => {
    return gulp.src('src/app.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

// Static server
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('watch', function (done) {
    gulp.watch("*.html", browserSync.reload());
    gulp.watch("*.js", browserSync.reload());
    gulp.watch("*.css", browserSync.reload());
    done();
});