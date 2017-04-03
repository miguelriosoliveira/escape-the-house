const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const gulp = require('gulp');
const rename = require("gulp-rename");

gulp.task('default', ['browser-sync', 'dist', 'watch']);

gulp.task('dist', () => {
    gulp.src('game.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('_dist/'));
    gulp.src('game.html')
        .pipe(rename("index.html"))
        .pipe(gulp.dest('_dist/'));
    return gulp.src('game.css')
        .pipe(gulp.dest('_dist/'));
});

// Static server
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "_dist/"
        }
    });
});

gulp.task('watch', function (done) {
    gulp.watch("game.html", ["dist"]);
    gulp.watch("game.css", ["dist"]);
    gulp.watch("game.js", ["dist"]);
    gulp.watch("_dist/**/*", browserSync.reload());
    done();
});