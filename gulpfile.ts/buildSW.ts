const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const browserify = require('gulp-browserify');
const merge = require('merge2');
const through = require('through2');
const fs = require("fs");
const uglify = require('gulp-uglify');

/**
 * 清空資源框架
 */
function cleanAsset(cb) {
    if (fs.existsSync('dist')) {
        console.log("cleanAsset");
        return gulp.src(['dist/sw/**'], {read: false, allowEmpty: true})
            .pipe(clean({force: true}));
    } else {
        console.error("not found!");
        cb();
    }
}

/**
 * 建構開發模式框架
 */
function buildSW(cb) {
    if (fs.existsSync('src')) {
        console.log("buildAsset");
        let tsFrameWork = gulp.src(['dist/sw.ts'])
            // .pipe(sourcemaps.init())                     //不導入 sourcemaps
            .pipe(ts.createProject('tsconfig.json', {
                target: "ES5",
            })())
            .on("error", function (err: any) {
                console.error(err.message);
            });

        return merge(
            tsFrameWork.js
                .pipe(uglify())
                .pipe(sourcemaps.write())
                .pipe(through.obj(function (chunk, enc, callback) {
                    let sdata = chunk.contents.toString();
                    chunk.contents = Buffer.from(sdata);
                    this.push(chunk)
                    callback();
                    //fcc-framework.js
                }))
                // .pipe(uglify())
                .pipe(gulp.dest('dist/sw')),
        );
    } else {
        console.error("not found!");
        cb();
    }
}


export const buildAssetSW = gulp.series(cleanAsset, buildSW);
