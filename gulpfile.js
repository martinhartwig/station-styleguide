// --------------------------------------------------------
// Dependencies
// --------------------------------------------------------
const pkg = require('./package.json');

const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack-stream');


// --------------------------------------------------------
// Configuration
// --------------------------------------------------------

// Project configuration.
let globalConfig = {
    paths: {
        dist: `${__dirname}/dist`,
        src: `${__dirname}/src`,
    },
};


// --------------------------------------------------------
// Tasks
// --------------------------------------------------------

function clean() {
    return del([
        `${globalConfig.paths.dist}`
    ]);
}

function styleguideJs() {
    return gulp.src(`${globalConfig.paths.src}/static/js/styleguide.js`)
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'styleguide.js',
            },
        }))
        .pipe(gulp.dest(`${globalConfig.paths.dist}/static/js/`));
}


function styleguideResources() {
    return gulp.src([`${globalConfig.paths.src}/static/**`, '!**/*.js'])
        .pipe(gulp.dest(`${globalConfig.paths.dist}/static`));
}


function styleguideApp() {
    return gulp.src([`${globalConfig.paths.src}/**`, `!${globalConfig.paths.src}/static/**`])
        .pipe(gulp.dest(`${globalConfig.paths.dist}`));
}

gulp.task('default', gulp.series(clean, gulp.parallel(styleguideJs, styleguideResources, styleguideApp)));
