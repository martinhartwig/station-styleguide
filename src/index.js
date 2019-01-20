// --------------------------------------------------------
// Dependencies
// --------------------------------------------------------
const pkg = require('../package.json');

// Utils
const _ = require('lodash');
const path = require('path');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');

// Misc
const markdown = require('gulp-markdown');
const data = require('gulp-data');
const rename = require('gulp-rename');
const hb = require('gulp-hb');
const Handlebars = require('handlebars');
const gap = require('gulp-append-prepend');

const globby = require('globby');
const flatmap = require('gulp-flatmap');

const screenshots = require('./screenshots');


// --------------------------------------------------------
// Configuration
// --------------------------------------------------------

// Project configuration.
let globalConfig = {
    paths: {
        dist: `${__dirname}/dist`,
        src: `${__dirname}/src`,
        static: `${__dirname}/static/`,
        templates: `${__dirname}/templates/`,
        helpers: `${__dirname}/template-helpers/`,
    },
    screenshots: {
        enabled: true,
        width: 1024,
        height: 768,
        wait: 2000,
        pagesGlob: [`*/**/*.html`, `!*/**/*-page.html`, `!*/**/*--html.html`],
    },
    logoUrl: [`${__dirname}/static/img/styleguide-logo.svg`],
    name: 'Styleguide',
};


// --------------------------------------------------------
// Tasks
// --------------------------------------------------------


function generateHome() {
    return gulp.src([`${globalConfig.paths.templates}index.hbs`])
        .pipe(hb({
            data: {
                'styleguide-name': globalConfig.name||'Styleguide',
                pathComponentPage: path.join(globalConfig.paths.src, 'index.html')
            },
            helpers: `${globalConfig.paths.helpers}**/*.js`
        }))
        .pipe(rename(function(path) {
            //path.basename += '-preview';
            path.extname = '.html';
        }))
        .pipe(gulp.dest(`${globalConfig.paths.dist}`));
}
function generateComponentPage() {
    const srcGlob = [`${globalConfig.paths.src}/**/*.hbs`, '!**/templates/**/*', `!${globalConfig.paths.src}/!*`];
    globby.sync(srcGlob).forEach( function(fileName) {
        _addReferencesFromFile(fileName);
    });

    return gulp.src(srcGlob)
        .pipe(flatmap(function(stream, file) {
            const filepath = path.relative(
                globalConfig.paths.src,
                path.dirname(file.path)
            );
            const staticStyleGuideResourcesPath = path.relative(
                filepath,
                `styleguide/static`
            );
            const basename = path.basename(file.path, '.hbs');
            gulp.src(`${globalConfig.paths.templates}/component-page.hbs`)
                .pipe(hb({
                    data: {
                        componentName: basename,
                        _componentpath: filepath,
                        _staticStyleGuideResourcesPath: staticStyleGuideResourcesPath,
                        allPartials: allPartials,
                        pathComponentPage: path.join(filepath, basename + '-page.html'),
                        filenameComponentPage: basename + '-page.html',
                        filenamePreview: basename + '.html',
                        filenameSourceHtml: path.join(globalConfig.paths.dist, filepath, basename + '--html.html'/*'-partial.html'*/),
                        filenameSourceHbs: path.join(globalConfig.paths.src, filepath, basename + '.hbs'),
                        filenameSourceJson: path.join(globalConfig.paths.src, filepath, basename + '.json'),
                        filenameMarkdown: path.join(path.dirname(file.path), basename + '.md')
                    },
                    helpers: `${globalConfig.paths.helpers}/**/*.js`
                }))
                .pipe(rename(function (srcPath) {
                    srcPath.dirname = filepath;
                    srcPath.basename = basename + '-page';
                    srcPath.extname = '.html';
                }))
                .pipe(gulp.dest(`${globalConfig.paths.dist}`));
            return stream;
        }));
}

var allPartials = [];

function _addReferencesFromFile(filepath) {
    const subPath = path.relative(
        globalConfig.paths.src,
        path.dirname(filepath)
    );
    var refs = _getPartialsFromTemplate(filepath);
    allPartials.push({
        partialName: path.basename(filepath, '.hbs'),
        partialPath: subPath,
        category: subPath.substring(subPath.indexOf('-') + 1, subPath.indexOf('/')),
        references: refs
    });
}
function _getPartialsFromTemplate(filePath) {
    const tpl = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const ast = Handlebars.parse(tpl);
    return _getPartialsFromHandlebarsAST(ast);
}
function _getPartialsFromHandlebarsAST(ast) {
    if (!ast || !ast.body) {
        return [];
    }
    return ast.body.reduce(function(acc, statement){
        var partials = [];
        if (statement.type === 'PartialStatement') {
            partials.push(statement.name.original);
        } else if (statement.type === 'BlockStatement') {
            partials = partials.concat( _getPartialsFromHandlebarsAST(statement.program) );
        }
        return acc.concat( partials )
            .filter( (value, index, self) => self.indexOf(value) === index );
    }, []);
}

function takeScreenshots(cb) {
    console.log('Capture screenshots ...');
    const captures = [];
    const srcGlob = globalConfig.screenshots.pagesGlob;
    globby
        .sync(srcGlob, {
            cwd: globalConfig.paths.dist,
        })
        .forEach( function(pagePath) {
            const name = path.basename(pagePath, '.html');
            const savePath = path.join(
                globalConfig.paths.dist,
                path.dirname(pagePath)
            );
            pagePath = path.join(globalConfig.paths.dist, pagePath);
            captures.push({
                url: 'file://' + pagePath,
                dest: `${savePath}/${name + '-thumbnail'}.png`,
            });
        });

    Promise.all([ screenshots({
        urls: captures,
        width: globalConfig.screenshots.width,
        height: globalConfig.screenshots.height,
        wait: globalConfig.screenshots.wait
    }) ])
        .then(() => cb());
}

function styleguideResources() {
    return gulp.src([`${globalConfig.paths.static}/**`])
        .pipe(gulp.dest(`${globalConfig.paths.dist}/styleguide/static`));
}

function styleguideCustomResourcesLogo() {
    return gulp.src(globalConfig.logoUrl)
        .pipe(rename(function(path) {
            path.basename = 'styleguide-logo';
        }))
        .pipe(gulp.dest(`${globalConfig.paths.dist}/styleguide/static/img`));
}



function styleguide(config, doneA) {

    globalConfig = _.defaultsDeep({}, config, globalConfig);

    let templates = gulp.series(generateHome, generateComponentPage);
    if (globalConfig.screenshots.enabled) {
        templates = gulp.series(generateHome, generateComponentPage, takeScreenshots);
    }

    // Task sets
    gulp.series(templates, styleguideResources, styleguideCustomResourcesLogo, function (doneB) {
        doneA();
        doneB();
    })();

}
module.exports = styleguide;
