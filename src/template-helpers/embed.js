/**
 * Handlebars Code Helpers
 * Copyright (c) 2013 Jon Schlinkert, Brian Woodward, contributors
 * Licensed under the MIT License (MIT).
 *
 * Edited by mha
 */
var path = require('path'),
    fs = require('fs'),
    Handlebars = require('handlebars'),
    beautify_html = require('js-beautify').html;

module.exports = {
    embed: function (options) {
        var src = /*process.cwd() + "/src/" + */options.hash.src,
            lang = options.hash.lang;
        /**
         * {{embed}}
         *
         * Embeds code from an external file as preformatted
         * text. The first parameter requires a path to the file
         * you want to embed. There second second optional parameter
         * is for specifying (forcing) syntax highlighting for
         * language of choice.
         *
         * @syntax:
         *   {{ embed src=[file] lang=[lang] }}
         * @usage:
         *   {{embed src='path/to/file.js'}} or
         *   {{embed src='path/to/file.hbs' lang='html'}}
         */
        try {
            var content = fs.readFileSync(src, 'utf8');
        } catch (e) {
            return '';
        }
        var ext = path.extname(src).replace(/^(\.)/gm, '');
        var beautify = false;
        var output;
        var codeStyle;

        lang = lang || ext;

        /*
         if (utils.isUndefined(lang)) {
         lang = ext;
         } else {
         lang = lang;
         }
         */
        switch (ext) {
            case 'md':
            case 'markdown':
            case 'mdown':
                codeStyle = 'md';
                output = content.replace(/^(```)/gm, '&#x60;&#x60;&#x60;');
                ext = 'md';
                break;
            case 'txt':
                output = content;
                ext = 'text';
                break;
            case 'hbs':
            case 'hbars':
                codeStyle = 'hbs';
                output = content.replace(/^(---)/gm, '---');
                ext = 'html';
                break;
            case 'html':
                codeStyle = 'html';
                output = content;
                beautify = true;
                break;
            case 'json':
                codeStyle = 'json';
                output = content;
                break;
            case void 0:
                output = content;
                ext = '';
                break;
            default:
                output = content;
                ext = '';
        }

        if (beautify) {
            output = beautify_html( output, {
                indent_size: 2,
                preserve_newlines: true,
                unformatted: [''],
                wrap_attributes: 'force',
                wrap_attributes_indent_size: 4,
                wrap_line_length: 144
            });
        }

        return new Handlebars.SafeString(
            `<div class="sg-tpl"><code class="${codeStyle}">${Handlebars.Utils.escapeExpression(output)}</code></div>\n`
        );
    }
};