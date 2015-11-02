var browserify = require('browserify'),
    del = require('del'),
    gulp = require('gulp'),
    buffer = require('gulp-buffer'),
    changed = require('gulp-changed'),
    concat = require('gulp-concat'),
    copy = require('gulp-copy'),
    debug = require('gulp-debug'),
    jshint = require('gulp-jshint'),
    react = require('gulp-react'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    mkdirp = require('mkdirp'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream');

// config to hold the path files
var paths = {
  server: ['./src/server/**/*.js'],
  client: ['./src/client/**/*.js']
};

var publicLibs = {
  react: './public/vendor/react/react.min.js',
  jquery: './public/vendor/jquery/dist/jquery.min.js',
  bootstrap: './public/vendor/bootstrap/dist/js/bootstrap.min.js'
}

// Made the tasks simpler and modular
// so that every task handles a particular build/dev process
// If there is any improvement that you think can help make these tasks simpler
// open an issue at https://github/com/ngenerio/generator-express-simple
// It can be made simpler

gulp.task('cleanServer', function()
{
  return del(['build/server/*', '!server/.git'], {dot: true}, function()
  {
    mkdirp('build/server');
  });
});

gulp.task('cleanClient', function()
{
  return del(['build/public/*', 'src/client/js/*'], {dot: true}, function()
  {
    mkdirp('build/public');
  });
})

gulp.task('clean', ['cleanServer', 'cleanClient']);

// Lint the javascript server files
gulp.task('lintserver', function () {
  return gulp
    .src(paths.server)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Lint the javascript client files
gulp.task('lintclient', function () {
  return gulp
    .src(paths.client)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Uglify the client/frontend javascript files
gulp.task('uglify', function () {
  return gulp
    .src(paths.client)
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/js'))
});

// Preprocess the less files into css files
gulp.task('less', function () {
  return gulp
    .src('./src/client/less/**/*.less')
    .pipe(less())
    .pipe(gulp.dest('./src/client/css'));
});

// Minify the css files to reduce the size of the files
// To avoid this task, import all the other less files into one file
// and rather process that file into a single file and jump straight to concatenation
// You can learn more about this from the twitter bootstrap project
gulp.task('css', function () {
  return gulp
    .src(['./src/client/css/**/*.css', '!./src/client/css/**/*.min.css'])
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./src/client/css'));
});

// Concat all the css files
/*gulp.task('concatCss', function () {
  return gulp
    .src(['./bower_components/bootstrap/dist/css/bootstrap.min.css', './src/client/css/styles.min.css'])
    .pipe(concat('app.styles.min.css'))
    .pipe(gulp.dest('./src/client/css'));
});
*/
gulp.task('concatCss', function () {
  return gulp
    .src(['./src/client/css/styles.min.css'])
    .pipe(concat('app.styles.min.css'))
    .pipe(gulp.dest('./src/client/css'));
});

gulp.task('compileJSX', function()
{
  return gulp
    .src('./src/client/jsx/*.jsx')
    .pipe(react())
    .pipe(gulp.dest("./src/client/js"));
});

gulp.task('buildDevelJs', function()
{
  return browserify('./app/main.js', {
      debug: true
    })
    .bundle()
    .pipe(source('./dist/app.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('deployServer', function()
{
  return gulp
    .src(['./src/server/*.js', './src/server/**/*'])
    .pipe(changed('build/server'))
    .pipe(copy('build/server', {prefix: 2 }))
    .pipe(gulp.dest('./build/server'));
});

gulp.task('deployClient', function()
{
  return gulp
    .src(['./src/client/css/*.*', './src/client/img/*.*', './src/client/app.js'])
    .pipe(changed('build/public'))
    .pipe(copy('build/public', {prefix: 2}))
    .pipe(gulp.dest('./build/public'));
});

gulp.task('deploy', ['deployClient', 'deployServer']);

gulp.task('lint', ['lintserver', 'lintclient']);
gulp.task('buildCss', function()
{
  return runSequence('less', 'css', 'concatCss');
});

gulp.task('buildJs', ['uglify', 'concatJs']);
gulp.task('watchDevel', function()
{
  gulp.watch(['./src/client/less/**/*.less'], ['buildCss']);
  gulp.watch(['./src/client/jsx/*.jsx'], ['compileJSX']);
  gulp.watch(['./src/client/js/*.js', './src/client/jsUtils/*.js', './src/client/jsController/*.js', './src/client/jsConfig/*.js', './src/client/actions/*.js', './src/client/dispatcher/*.js', './src/client/stores/*.js'], ['buildDevelJs']);
  gulp.watch(['./src/server/*.js', './src/server/**/*'], ['deployServer']);
  gulp.watch(['./src/client/css/*.*', './src/client/img/*.*', './src/client/app.js'], ['deployClient']);
});
gulp.task('build', function()
{
  return runSequence('compileJSX', 'buildDevelJs', 'buildCss', 'deploy');
});
gulp.task('devel', function()
{
  return runSequence('clean', 'build', 'watchDevel');
});
gulp.task('default', ['watch']);
