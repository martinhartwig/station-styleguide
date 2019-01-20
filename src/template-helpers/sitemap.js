var fs = require('fs'),
    path = require('path'),
    Handlebars = require('handlebars');

var _getAllFilesFromFolder = function (dir) {

    var results = [];

    if (!fs.existsSync(dir)) {
        console.warn(`{{sitemap}} helper: Cannot read directory '${dir}'.`);
        return 'Path does not exist.';
    }

    fs.readdirSync(dir).forEach(function (fileName) {

        var filepathAbsolute = dir + '/' + fileName,
            stat = fs.statSync(filepathAbsolute);

        // console.log(dir);
        if (fileName === 'templates' || (!stat.isDirectory() && dir === '/')) {
            // console.log( 'ignore', fileName );
        } else if (stat && stat.isDirectory()) {
            var dirItems = _getAllFilesFromFolder(filepathAbsolute);
            if (dirItems.length) {
                var fileObject = {
                    "isDir": true,
                    "title": fileName,
                    "url": fileName,
                    "items": dirItems
                };
                results.push(fileObject);
            }
        } else {
            var ext = fileName.slice(fileName.lastIndexOf(".")),
                name = fileName.slice(0, fileName.lastIndexOf("."));
            if (ext === ".hbs") {
                var fileObject = {
                    "isDir": false,
                    "title": name,
                    "url": name
                };
                results.push(fileObject);
            }
        }
    });

    return results;
};

var _printItem = function (item, dirName, currentUrl) {
    if (item.url) {

        var linkUrl = '';
        if (currentUrl) {
            linkUrl = path.relative( path.dirname(currentUrl), dirName ) + '/';
        }
        if (linkUrl === '/') {
            linkUrl = './'
        }
        if (['index', 'all', 'home', 'sitemap'].indexOf(path.basename(item.url)) !== -1) {
            linkUrl += path.basename(item.url) + '.html';
        } else {
            linkUrl += item.url + '-page.html';
        }
        var isActive = (dirName + '/' + item.url + '-page.html' === currentUrl);
        var styleClass = isActive ? 'sg-list__item--active' : '';
        return '<li class="' + styleClass + '"><a href="' + linkUrl + '">' + item.title + '</a></li>';
    } else {
        return '<li>' + item.title + '</li>';
    }
};
var _printDir = function (dirObj, dirName, currentUrl) {
    if (!dirName) {
        dirName = "";
    }
    var output = '<ul>';
    for (var i = 0; i < dirObj.length; i++) {
        item = dirObj[i];
        if (item.isDir) {
            if (item.items.length === 1 && !item.items[0].isDir) {
                output += _printItem(item.items[0], path.join(dirName, item.url), currentUrl);
            } else {
                output += "<li><h2>" + item.title + "</h2>";
                output += _printDir(item.items, path.join(dirName, item.url), currentUrl);
                output += "</li>";
            }
        } else {
            output += _printItem(item, dirName, currentUrl);
        }
    }
    output += '</ul>';

    return output;
};

module.exports = {
    sitemap: function (options) {
        var rootPath = path.join(process.cwd(), "src", options.hash.rootNode || '');
        var currentUrl = '';
        if (options.hash.currentUrl) {
            currentUrl = options.hash.currentUrl;
        }
        if (!path.isAbsolute(currentUrl)) {
            currentUrl = path.join(rootPath, currentUrl);
        }

        var files = {
            "items": _getAllFilesFromFolder( rootPath )
        };

        if (!options.hash.rootNode) {
            // console.log( path.dirname(currentUrl), rootPath, path.relative( path.dirname(currentUrl), rootPath ) );
            files.items.unshift({
                "isDir": false,
                "title": 'Start',
                "url": path.relative( path.dirname(currentUrl), rootPath ) + '/index'
            });
        }
        var output = _printDir(files.items, rootPath, currentUrl);

        return new Handlebars.SafeString(
            output
        );
    }
};
