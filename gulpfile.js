"use strict";

//common
const gulp = require('gulp');
const plumber = require('gulp-plumber'); // Stream中のエラーによる強制停止を防止
// const browserSync = require("browser-sync"); // ファイルの変更を監視。変更を即座にブラウザーに反映
const wait = require('gulp-wait'); // 通信環境やファイル容量次第でコンパイルエラーが起こる際に使用

// ejs
const ejs = require('gulp-ejs');
const rename = require('gulp-rename'); // ファイルのrename
const replace = require('gulp-replace'); // Stream中に正規表現による文字列置換を行う

// sass
// const sass = require('gulp-sass');
const sass = require('gulp-sass')(require('sass')); // Dart Sass 使用
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require('gulp-clean-css'); // cssの圧縮
const sassGlob = require('gulp-sass-glob-use-forward'); // ディレクトリ毎にsassファイルをまとめてimport

// json
const data = require('gulp-data'); // meta情報を一括管理
const fs = require('fs'); // 外部jsonを同期処理読み込み

// webpack
const webpack = require("webpack");
const webpackStream = require("webpack-stream"); // gulpでwebpackを使うために必要なプラグイン
const webpackConfig = require("./webpack.config"); // webpackの設定ファイルの読み込み

//path
const SRC = './src';
const HTDOCS = './public';
const BASE_PATH = '/';
const DEST = `${HTDOCS}${BASE_PATH}`;

// sass
const sass2css = (done) => {
  return gulp.src(['src/assets/scss/**/*.scss', '!src/assets/scss/_**/**'], {
      sourcemaps: true
    })
    .pipe(wait(500))
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(autoprefixer({
      grid: true
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${DEST}assets/css/`, {
      sourcemaps: './'
    }))
    // .pipe(browserSync.stream());

  done();
};

// ejs
const html2ejs = (done) => {
  return gulp.src(
      ['src/**/*.ejs', '!src/**/_*.ejs', '!src/_**/**']
    )
    .pipe(plumber())

    // json取得→ルートディレクトリ&metaを定義
    .pipe(data(function (file) {
      const confJson = `./src/${BASE_PATH}/json/config.json`;
      const conf = JSON.parse(fs.readFileSync(confJson, 'utf8'));

      const filePath = {};

      if (file.path.length !== 0) {
        let path = file.path.split('¥').join('/');
        path = path.split('\\').join('/');

        const filename = path.match(/^.+\/src\/(.+)\.ejs$/)[1];
        filePath.dir = path.match(/^.+\/src\//)[0];

        var meta = {};
      }
      return {
        filePath: filePath,
        meta: meta,
        conf: conf
      };
    }))
    .pipe(ejs())
    .pipe(rename({
      extname: '.html'
    }))
    // 2行以上の空行は削除(win用にCR+LFを再変換する)
    .pipe(replace("\n", "\r\n"))
    .pipe(replace("\r\r", "\r"))
    .pipe(replace(/(\r\n){2,}/g, '\n\n'))
    .pipe(gulp.dest(`${HTDOCS}`))

  done();
};

// ts(webpack)
const ts2js = (done) => {
  return gulp.src(`${SRC}/assets/js/main.ts`)
    // webpackStreamの第2引数にwebpackを渡す
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(plumber())
    .pipe(gulp.dest(`${DEST}assets/js/`));

  done();
};

const watch = (done) => {
  gulp.watch([`${SRC}/assets/scss/**/*.scss`]).on('change', gulp.series(sass2css));
  gulp.watch([`${SRC}/assets/js/**/*.ts`, `${SRC}/assets/js/**/*.vue`]).on('change', gulp.series(ts2js));
  gulp.watch([`${SRC}/**/*.ejs`]).on('change', gulp.series(html2ejs));

  done();
};


// タスクの実行
exports.dev = gulp.series(sass2css, html2ejs, ts2js, watch);
exports.ts = gulp.series(html2ejs);
exports.build = gulp.series(sass2css, html2ejs, ts2js);
