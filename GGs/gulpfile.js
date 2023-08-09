const gulp = require('gulp');
const babel = require('gulp-babel');
const through2 = require('through2');

const paths = {
  dest: {
    lib: 'lib', // commonjs 文件存放的目录名 - 本块关注
    esm: 'esm', // ES module 文件存放的目录名 - 暂时不关心
    dist: 'dist', // umd文件存放的目录名 - 暂时不关心
  },
  styles: 'components/**/*.less', // 样式文件路径 - 暂时不关心
  scripts: [
    'components/**/*.{ts,tsx}',
    '!components/**/demo/*.{ts,tsx}',
    '!components/**/__tests__/*.{ts,tsx}',
  ], // 脚本文件路径
};

/**
 * 编译脚本文件
 * @param {string} babelEnv babel环境变量
 * @param {string} destDir 目标目录
 */
function compileScripts(babelEnv, destDir) {
  const { scripts } = paths;
  // 设置环境变量
  process.env.BABEL_ENV = babelEnv;
  return gulp
    .src(scripts)
    .pipe(babel()) // 使用gulp-babel处理
    .pipe(
      through2.obj(function z(file, encoding, next) {
        this.push(file.clone());
        // 找到目标
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
          const tempFile = file;
          const content = tempFile.contents.toString(encoding);
          tempFile.contents = Buffer.from(cssInjection(content)); // 文件内容处理
          tempFile.path = file.path.replace(/index\.js/, 'css.js'); // 文件重命名
          this.push(tempFile); // 新增该文件
          next();
        } else {
          next();
        }
      }),
    )
    .pipe(gulp.dest(destDir));
}

function cssInjection(content) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.less/g, '.css');
}

/**
 * 编译cjs
 */
function compileCJS() {
  const { dest } = paths;
  return compileScripts('cjs', dest.lib);
}

/**
 * 编译esm
 */
function compileESM() {
  const { dest } = paths;
  return compileScripts('esm', dest.esm);
}

// 串行执行编译脚本任务（cjs,esm） 避免环境变量影响
const buildScripts = gulp.series(compileCJS, compileESM);

function copyLess() {
  return gulp
    .src(paths.styles)
    .pipe(gulp.dest(paths.dest.lib))
    .pipe(gulp.dest(paths.dest.esm));
}

// 整体并行执行任务
const build = gulp.parallel(buildScripts, copyLess);

exports.build = build;

exports.default = build;