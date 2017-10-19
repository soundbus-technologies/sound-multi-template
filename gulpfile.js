// TODO
// 1.压缩编译js
// 2.压缩编译sass 加浏览器前缀 资源文件转base64 px转rem
// 3.静态资源文件加版本号
// 4.gulp同步执行任务
// 5.监听文件增删查改变化执行 cb
// 6.删除 tmp
// 7.替换某些字符串
// 8.自动刷新
// 9.部署上传
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const ugjs = require('gulp-uglify'); // 压缩js
const watch = require('gulp-watch'); // 另一个watch封装，gulp.watch方法不能监听到文件增删查改
const webpackStream = require('webpack-stream'); // webpack的一个封装 版本1.x
const webpack = require('webpack');
const named = require('vinyl-named'); // 可以读到文件信息，给文件重命名
const del = require('del'); // 删除文件
const watchPath = require('gulp-watch-path'); // watch 文件path
const replace = require('gulp-replace'); // 字面意思

const rev = require('gulp-rev'); // 加文件指纹 （版本号）
const htmlreplace = require('gulp-html-replace'); // html模块替换
const ifElse = require('gulp-if-else'); // 字面意思
const browserSync = require('browser-sync').create();
const base64 = require('gulp-base64'); // 转 base64
const runSequence = require('run-sequence'); // 同步执行任务
const bsReload = browserSync.reload;
const postcss = require('gulp-postcss'); //postcss本身
const autoprefixer = require('autoprefixer'); // 浏览器前缀
const precss = require('precss'); //提供像scss一样的语法
const cssnano = require('cssnano');  //更好用的css压缩!
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps'); // 字面意思
const revCollector = require('gulp-rev-collector'); // 换md5版本号
const htmlmin = require('gulp-htmlmin');
const exec = require('child_process').exec; // 执行 shell
let CDN = '//soundbus-media-hd.oss-cn-hangzhou.aliyuncs.com'; //  阿里云

var webpackConfig = {
  resolve: {
    root: path.join(__dirname, 'node_modules'),
    alias: {
      components: '../../components', // 组件别名,js里引用路径可直接 'components/xxx/yyy'
      apis: '../../apis',
    },
    extensions: ['', '.js', '.vue', '.scss', '.css']
  },
  output: {
    // publicPath: 'yourcdnlink/static/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].js?[hash]',
    sourceMapFilename: 'js/[name].js.map',
  },
  module: {
    noParse: [/vue.js/],
    /* preLoaders: [
     { test: /\.js|vue$/, loader: "eslint-loader", exclude: /node_modules/ }
     ],*/
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000, // 换成你想要得大小
          name: 'images/[name].[ext]?[hash:10]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000, // 换成你想要得大小
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [],
  devtool: 'source-map',
  babel: { //配置babel
    "presets": ["es2015", 'stage-2'],
    "plugins": ["transform-runtime"]
  }
};

const processes = [
  autoprefixer({ browsers: ['last 2 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4', '> 10%'] }),
  precss,
  cssnano
];
// background: color($blue blackness(20%));  precss为了用这样的语法
const src = {
  css: './src/css/**/*.css',
  mock: './src/mock/**/*.js',
  fonts: './src/fonts/**/*.{eot,svg,ttf,woff}',
  images: './src/images/**/*.{png,jpg,jpeg,svg}',
  js: './src/js/**/*.js',
  sass: './src/sass/**/*.scss',
  components: './src/components/**/*.{vue,jsx}',
  views: './src/views/**/*.html'
};
const dist = {
  css: './public/css/',
  fonts: './public/fonts/',
  images: './public/images/',
  mock: './public/mock/',
  js: './public/js/',
  sass: './public/sass/',
  views: './public/views'
};
// dev启动
// 1.编译移动页面到public          OK
// 2.编译scss 输出到public         OK
// 3.编译js文件 输出public         OK
// 4.编译组件                      OK
// 5.输出图片和字体文件             OK
// 6.监听所有类型文件执行不同task    OK

// build
// 编译 压缩 css
// 编译 压缩 js
// 移动 图片和字体

// 后台的reload 看页面
var BUILD = 'DEV';
var isCDN = false;
gulp.task('views', function () {
  return gulp.src(src.views)
  .pipe(gulp.dest(dist.views));
});
gulp.task('views:mock', function () {
  return gulp.src(src.views)
  .pipe(htmlreplace({
    js: {
      src: '',
      tpl: '<script>var INIT_STATE = {$state};</script>'
    }, dev: {
      src: '',
      tpl: '<script>var DEV = false;</script>'
    }
  }))
  .pipe(gulp.dest(dist.views));
});
gulp.task('mock', function () {
  return gulp.src(src.mock)
  .pipe(gulp.dest(dist.mock))
});

gulp.task('sass', function () {
  return gulp.src(src.sass)
  .pipe(ifElse(BUILD !== 'PUBLIC', sourcemaps.init))
  .pipe(sass().on('error', sass.logError))
  .pipe(ifElse(BUILD !== 'PUBLIC', function () {
    return sourcemaps.write('./maps')
  }))
  .pipe(gulp.dest('./src/css'))
  .pipe(gulp.dest('./public/css'));
});
gulp.task('reload', function () {

  webpackConfig.plugins.push(new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'dev'
  }), new webpack.NoErrorsPlugin());
  runSequence('views', 'sass', 'mock', 'js', 'images', 'fonts', function () {
    browserSync.init(src.views, {
      startPath: "/views/",
      server: {
        baseDir: ['./public']
      },
      notify: false
    });
    dev();// watch

  });

});
gulp.task('reload:mock', function () {

  webpackConfig.plugins.push(new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'dev'
  }), new webpack.NoErrorsPlugin());
  runSequence('views:mock', 'sass', 'mock', 'js', 'images', 'fonts', function () {
    browserSync.init(src.views, {
      startPath: "/views/",
      server: {
        baseDir: ['./public']
      },
      notify: false
    });
    dev();// watch

  });

});
function dev() {
  watch([src.views], function () {
    runSequence('views', function () {
      bsReload()
    });
  });
  watch([src.mock], function () {
    runSequence('mock', function () {
      bsReload()
    });
  });
  watch([src.images], function () {
    runSequence('images', function () {
      bsReload()
    });
  });
  watch([src.fonts], function () {
    runSequence('fonts', function () {
      bsReload()
    });
  });
  watch([src.sass], function () {
    runSequence('sass', function () {
      bsReload();
    });
  });
  watch([src.js], function (event) {
    var paths = watchPath(event, src.js, './public/js/');
    var sp = paths.srcPath.indexOf('\\') > -1 ? '\\' : '/';
    console.log(paths.srcPath);
    if (paths.srcPath.split(sp).length === 3) { // 共有库情况,要编译所有js
      compileJS(['./src/js/**/*.js', '!./src/js/lib/*.js']);
    } else if (paths.srcPath.indexOf('js/lib') > 0) {
      cp('./src/js/lib/*.js', './public/js/lib');
    } else { // 否则 只编译变动js
      compileJS([paths.srcPath, '!./src/js/lib/*.js']);
    }
  });
  watch(['./src/components/**/*.vue'], function (event) {
    var sp = event.path.indexOf('\\') > -1 ? '\\' : '/';
    var business = event.path.split(sp).slice(-2);
    var jsFile = business[1].split('-')[0];
    var path;
    if (business[0] === 'common') {
      path = ['./src/js/**/*.js', '!./src/js/lib/*.js'];
    } else if (business[0] === jsFile) {
      path = './src/js/' + business[0] + '/*.js';
    } else {
      path = './src/js/' + business[0] + '/' + jsFile + '.js';
    }
    compileJS(path);
  })

}

gulp.task('js', function () {
  cp('./src/js/lib/*.js', './public/js/lib');
  return compileJS(['./src/js/**/*.js', '!./src/js/lib/*.js']);
});

gulp.task('images', function () {
  gulp.src(src.images)
  .pipe(gulp.dest(dist.images));
});
gulp.task('fonts', function () {
  return gulp.src(src.fonts)
  .pipe(gulp.dest(dist.fonts));
});
gulp.task('js:build', function () {
  cp('./src/js/lib/*.js', './src/tmp/js/lib');
  return compileJS(['./src/js/**/*.js', '!./src/js/lib/*.js'], './src/tmp');
});
gulp.task('ugjs:build', function () {
  return gulp.src('./src/tmp/**/*.js')
  // .pipe(ifElse(BUILD === 'PUBLIC', ugjs))
  .pipe(rev())
  .pipe(gulp.dest('./public/'))
  .pipe(rev.manifest())
  .pipe(gulp.dest('./public/'))
});
function compileJS(path, dest) {
  dest = dest || './public';
  webpackConfig.output.publicPath = isCDN === true ? '' + CDN + '/' : '/';

  return gulp.src(path)
  .pipe(named(function (file) {
    var path = JSON.parse(JSON.stringify(file)).history[0];
    var sp = path.indexOf('\\') > -1 ? '\\js\\' : '/js/';
    var target = path.split(sp)[1];
    return target.substring(0, target.length - 3);
  }))
  .pipe(webpackStream(webpackConfig))
  .on('error', function (err) {
    this.end()
  })
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(gulp.dest(dest))
}
function cp(from, to) {
  gulp.src(from)
  .pipe(gulp.dest(to));
}

gulp.task('views:build', function () {
  const options = {
    removeComments: true,  //清除HTML注释
    collapseWhitespace: true,  //压缩HTML
    collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
    removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
    minifyJS: true,  //压缩页面JS
    minifyCSS: true  //压缩页面CSS
  };
  return gulp.src(['./public/**/*.json', src.views])
  .pipe(revCollector({
    replaceReved: true
  }))
  .pipe(htmlreplace({
    js: {
      src: '',
      tpl: ''
    }, init: {
      src: '',
      tpl: fs.readFileSync('./template.html', 'utf8')
    }
  }))
  .pipe(replace('../../', '' + CDN + '/')) // 替换html页面静态资源地址
  .pipe(replace('../', '' + CDN + '/')) // 替换html页面静态资源地址
  .pipe(htmlmin(options))
  .pipe(gulp.dest(dist.views));
});

gulp.task('views:dev', function () {
  const options = {
    removeComments: true,  //清除HTML注释
    collapseWhitespace: true,  //压缩HTML
    collapseBooleanAttributes: true,  //省略布尔属性的值 <input checked="true"/> ==> <input checked />
    removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
    minifyJS: true,  //压缩页面JS
    minifyCSS: true  //压缩页面CSS
  };
  return gulp.src(['./public/**/*.json', src.views])
  .pipe(revCollector({
    replaceReved: true
  }))
  .pipe(htmlreplace({
    js: {
      src: '',
      tpl: ''
    }, init: {
      src: '',
      tpl: fs.readFileSync('./vconsole.html', 'utf8')
    }
  }))
  .pipe(replace('../../', '' + CDN + '/')) // 替换html页面静态资源地址
  .pipe(replace('../', '' + CDN + '/')) // 替换html页面静态资源地址
  .pipe(htmlmin(options))
  .pipe(gulp.dest(dist.views));
});

gulp.task('build:dev', function () { // 和线上配置一样，除了不压缩js
  CDN = '';
  webpackConfig.module.preLoaders = [];
  isCDN = true;
  webpackConfig.devtool = false;
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'production'
  }));
  runSequence('clean', 'sass', 'js:build', 'ugjs:build', 'views:dev', 'images', 'fonts', function () {
    // 上传静态资源文件到CDN
    del(['./src/tmp']);
    /*exec('node aliUpload.js', function (err, output) {
     if (err) console.log(err);
     console.log(output);
     });*/
  });
});
gulp.task('build:aws', function () { // 和线上配置一样，除了不压缩js
  CDN = '';
  webpackConfig.module.preLoaders = [];
  isCDN = true;
  webpackConfig.devtool = false;
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'production'
  }));
  runSequence('clean', 'sass', 'js:build', 'ugjs:build', 'views:build', 'images', 'fonts', function () {
    // 上传静态资源文件到CDN
    del(['./src/tmp']);
    /*exec('node aliUpload.js', function (err, output) {
     if (err) console.log(err);
     console.log(output);
     });*/
  });
});
gulp.task('build', function () { // 发布
  webpackConfig.module.preLoaders = [];
  BUILD = 'PUBLIC';
  isCDN = true;
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'production'
  }));
  runSequence('clean', 'sass', 'css:build', 'js:build', 'ugjs:build', 'views:build', 'images', 'fonts', function () {
    // 上传静态资源文件到CDN
    del(['./src/tmp']);
    exec('node aliUpload.js', function (err, output) {
      if (err) console.log(err);
      console.log(output);
    });
  });
});
gulp.task('css:build', function () {
  return gulp.src(src.css)
  .pipe(base64({
    extensions: ['png', /\.jpg#datauri$/i],
    maxImageSize: 10 * 1024 // bytes,
  }))
  .pipe(ifElse(BUILD === 'PUBLIC', function () {
    return postcss(processes)
  }))
  .pipe(rev())
  .pipe(gulp.dest(dist.css))
  .pipe(rev.manifest())
  .pipe(gulp.dest(dist.css))

});

gulp.task('clean', function () {
  del([
    'public/**/*'
  ]);
});
