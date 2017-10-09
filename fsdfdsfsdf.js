var gulp        = require('gulp');
var less        = require('gulp-less');
var browserSync = require('browser-sync').create();
var del         = require('del');
var jshint      = require('gulp-jshint');
var concat      = require('gulp-concat');
var uglify     = require('gulp-uglify');
var babel       = require('gulp-babel');

//Will watch for all files and directories with js files
gulp.task('hint', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});
//Will watch just for one parent less file
gulp.task('less',function(){
    gulp.src('./src/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('./prod/css'));
});
//Will compile js-file and push to dir.es5
gulp.task('compile', function () {
    return gulp.src('./src/js/es6/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./src/js/es5'));
});
//Will copy and send to prod dir. in this situation just index.html
gulp.task('views', function () {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./prod/'))
});
//Concat, uglify
gulp.task('optimization', function() {
    return gulp.src('./src/js/es5/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./prod/js'));
});

//Will delete/clean dir. for new files
gulp.task('del',function(){
    del.sync(['./prod']);
});
//Will start server and watch live relod
gulp.task('server', function() {
    browserSync.init({
        server: {
            port:9000,
            baseDir: "prod"
        }
    });
    gulp.watch("src/**/*").on("change",browserSync.reload);
});

gulp.task('default',['server','build','watch']);

gulp.task('build',('del',['compile','optimization','less','views']));

gulp.task('watch', function() {
    gulp.watch('src/**/*',['build']);
    // gulp.watch('src/js/**/*.js',['hint']); or
    gulp.watch('src/js/es5/*.js',['hint']);
});
