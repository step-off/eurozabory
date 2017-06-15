var gulp         = require('gulp'),
	
    less         = require('gulp-less'),
    
    //Плагины для предотварищения обрыва watch при ошибке
    plumber      = require('gulp-plumber'), 
    gutil        = require('gulp-util'), 

    
    // Подключаем gulp-uglifyjs (для сжатия JS)
    uglify       = require('gulp-uglifyjs'), 
    
    // Подключаем библиотеку для переименования файлов
    rename       = require('gulp-rename'),

    // Подключаем библиотеку для автоматического добавления префиксов 
    autoprefixer = require('gulp-autoprefixer'),
	
    browserSync  = require('browser-sync').create(),

    //jade         = require('gulp-jade'),

    pug = require('gulp-pug'),

    // Подключаем gulp-concat (для конкатенации файлов)
    concat       = require('gulp-concat'), 

    // Подключаем библиотеки для работы с изображениями
    pngquant     = require('imagemin-pngquant'), 
    imagemin     = require('gulp-imagemin'),

    babel = require("gulp-babel"),
    
   // gulpCopy = require('gulp-copy'),

    svgSprite = require('gulp-svg-sprites'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    cssnano = require('gulp-cssnano'),
    flatten = require('gulp-flatten');

//=========== Tasks
// Jade
/*gulp.task('jade', function() {
    return gulp.src('app/jade/*.jade')
	    .pipe(plumber(function (error) {
                gutil.log(error.message); //Продолжаем watch после ошибки
                this.emit('end');
        }))
        .pipe(jade({pretty: true})) 
        .pipe(gulp.dest('app')) 
});*/
//Перезагрузка после изменения  .jade
//gulp.task('jade-watch', ['jade'], browserSync.reload);
gulp.task("bs", function(){
  browserSync.init({
    server: {
        baseDir: 'app'
    },
    ui: false
});
});


gulp.task('pug', function() {
  return gulp.src('app/pug/*.pug')
    .pipe(plumber())
    .pipe(pug(/*{pretty: false}*/))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream())
});

//gulp.task('pug-watch', ['pug'], browserSync.reload);

gulp.task('less', function() { 
	return gulp.src('app/less/style.less')
        .pipe(plumber(function (error) {
                gutil.log(error.message); //Продолжаем watch после ошибки
                this.emit('end');
        }))
		.pipe(less())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(cssnano())
    .pipe(gulp.dest('app/css/')) 
		.pipe(browserSync.stream())
});

gulp.task("babel-js", function () {
  return gulp.src("app/js/es6/common.js")
    .pipe(plumber(function (error) {
        gutil.log(error.message); 
        this.emit('end');
    }))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest("app/js"));
});

gulp.task('jsminify', function() {
    return gulp.src('app/js/common.js') 
        .pipe(uglify()) 
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('dist/js'));
});

gulp.task('libminify', function() {
    return gulp.src(['app/libs/jquery.min.js',
      'app/libs/jquery.magnific-popup.min.js',
      'app/libs/component.selectfx.js']) 
        .pipe(concat('libs.min.js')) 
        .pipe(uglify()) 
        .pipe(gulp.dest('dist/js'));
});

gulp.task('imgmin', function() { 
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('docs/img')); 
});

// Создаем таск browser-sync
/*gulp.task('browser-sync', function() { 
    browserSync({
       //proxy: 'pink.sl'
      baseDir: 'app' // Директория для сервера
    });
   
});*/

gulp.task('svgsprite', function () {
  return gulp.src('app/img/svg/*.svg')
      // minify svg
      .pipe(svgmin({
          js2svg: {
              pretty: true
          }
      }))
      // remove all fill and style declarations in out shapes
      /*.pipe(cheerio({
          run: function ($) {
              $('[fill]').removeAttr('fill');
              $('[style]').removeAttr('style');
          },
          parserOptions: { xmlMode: true }
      }))*/
      // cheerio plugin create unnecessary string '>', so replace it.
      .pipe(replace('&gt;', '>'))
      // build svg sprite
      .pipe(svgSprite({
              mode: "symbols",
              preview: false,
              selector: "icon-%f",
              svg: {
                  symbols: 'svg_sprite.html'
              }
          }
      ))
      .pipe(gulp.dest("app/img"));
});

gulp.task('watch', ['imgmin', "bs", 'jsminify', 'pug', 'less', 'babel-js'], function() {
    gulp.watch('app/**/*.less', ['less']);
    gulp.watch('app/js/es6/common.js', ['babel-js']);
    //gulp.watch('app/**/*.pug', ['pug-watch']);
    gulp.watch('app/**/*.pug', ['pug']);
   // gulp.watch('app/*.html').on('change', browserSync.reload);
    //gulp.watch('app/js/**/*.js').on('change', browserSync.reload); 
    browserSync.watch('app/*.html').on('change', browserSync.reload);
  browserSync.watch('app/js/**/*.js').on('change', browserSync.reload);
});



gulp.task('default', ['watch']);