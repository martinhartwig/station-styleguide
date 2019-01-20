
function generateDoc() {
    return gulp.src([`${globalConfig.paths.src}/**/*.md`, '!**/templates/**/*', '!*'])
        .pipe(markdown())
        .pipe(gulp.dest(`${globalConfig.paths.dist}`));
}

function generateHtml() {
    allPartials = [];
    return gulp.src([`${globalConfig.paths.src}/**/*.hbs`, '!**/templates/**/*', `!${globalConfig.paths.src}/*`])
    // Load an associated JSON file per post.
        .pipe(data(function(file) {
            _addReferencesFromFile(file.path);
            const dataFilename = file.path.replace('.hbs', '.json');
            if (!fs.existsSync(dataFilename)) {
                return {};
            }
            var hbsData = Object.assign({}, require(dataFilename), {
                _filepath: path.dirname(file.path)
            });
            return hbsData;
        }))
        .pipe(hb({
            data: `${globalConfig.paths.src}/**/*.json`,
            parseDataName: function(options, file) {
                return path.basename(file.path, '.json');
            },
            partials: `${globalConfig.paths.src}/**/*.hbs`,
            parsePartialName: function(options, file) {
                return path.basename(file.path, '.hbs');
            },
            helpers: `${globalConfig.paths.helpers}/**/*.js`
        }))
        .pipe(rename(function(path) {
            path.basename += '-partial';
            path.extname = '.html';
        }))
        .pipe(gulp.dest(`${globalConfig.paths.dist}`));
}
function generateHtmlPreview() {
    const separatorHeader = '<!-- HEADER -->';
    const separatorFooter = '<!-- FOOTER -->';

    return gulp.src([`${globalConfig.paths.src}/**/*.hbs`, '!**/templates/**/*', `!${globalConfig.paths.src}/*`])
        .pipe(gap.prependText(separatorHeader))
        .pipe(gap.prependFile(path.join(globalConfig.paths.templates, 'styleguide-pre.hbs')))
        .pipe(gap.appendText(separatorFooter))
        .pipe(gap.appendFile(path.join(globalConfig.paths.templates, 'styleguide-post.hbs')))
        // Load an associated JSON file per post.
        .pipe(data(function(file) {
            const dataFilename = file.path
                .replace('.hbs', '.json');
            if (!fs.existsSync(dataFilename)) {
                return {};
            }
            var hbsData = Object.assign({}, require(dataFilename), {
                _filepath: path.dirname(file.path)
            });
            return hbsData;
        }))
        .pipe(hb({
            data: `${globalConfig.paths.src}/**/*.json`,
            parseDataName: function(options, file) {
                return path.basename(file.path, '.json');
            },
            partials: `${globalConfig.paths.src}/**/*.hbs`,
            parsePartialName: function(options, file) {
                return path.basename(file.path, '.hbs');
            },
            helpers: `${globalConfig.paths.helpers}/**/*.js`
        }))
        .pipe(rename(function(path) {
            //path.basename += '-preview';
            path.extname = '.html';
        }))
        .pipe(gulp.dest(`${globalConfig.paths.dist}`));
}