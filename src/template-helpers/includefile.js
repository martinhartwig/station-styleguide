/**
 * Handlebars Code Helpers
 * Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 *
 * Edited by mha
 */
var fs = require('fs'),
    path = require('path'),
    Handlebars = require('handlebars');

module.exports = {
    includefile: function (options) {
        var src = options.hash.src;
        if (options.hash.basepath) {
            src = path.join(options.hash.basepath, src);
        }
        /**
         * {{include}}
         *
         * Includes code from an external file.
         * The first parameter requires a path to the file
         * you want to embed.
         *
         * @syntax:
         *   {{ include src=[file] }}
         * @usage:
         *   {{include src='path/to/file.svg'}}
         */
        if (!fs.existsSync(src)) {
            return '';
        }

        // console.log( '(includefile) src', src );
        var content = fs.readFileSync(src, 'utf8');
        return new Handlebars.SafeString(content);
    }
};