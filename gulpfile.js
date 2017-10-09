var gulp    = require('gulp');
var less    = require('gulp-less');
var path    = require('path'),
browserSync = require('browser-sync').create(),
del         = require('del'),
jshint      = require('gulp-jshint'),
concat      = require('gulp-concat'),
uglify      = require('gulp-uglify'),
babel       = require('gulp-babel');

//will copy all js files
gulp.task('scripts', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});
//      less --> ccs
gulp.task('less',function(){
    gulp.src('./src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./prod/css'));
});
//will copy all html files
gulp.task('views', function () {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./prod/'))
});

//Will compile js-file ES 6 --> ES 5
gulp.task('compile', function () {
    return gulp.src('./src/js/es6/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./src/js/es5'));
});

//clean all file in prod
gulp.task('clean',function(){
    del.sync(['./prod/**/*']);
});

//Will start server and watch live relod
gulp.task('server', function() {
    browserSync.init({
        server: {
            port:3000,
            baseDir: "prod"
        }
    });
    gulp.watch("src/**/*").on("change",browserSync.reload);
});

// watch
gulp.task('watch', function() {
    gulp.watch('src/**/*',['build']);
    gulp.watch('src/js/es5/*.js',['scripts']);
});
//will optimization files
gulp.task('optimization', function() {
    return gulp.src('./src/js/es5/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./prod/js'));
});

gulp.task('default',['server','build','watch']);

gulp.task('build',('clean',['compile','optimization','less','views']));