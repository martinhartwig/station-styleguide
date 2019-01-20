var Handlebars = require('handlebars');

module.exports = {
    'strip-header-footer': function (options) {
        return new Handlebars.SafeString(
            options.fn(this).replace(/[^>]*&lt;!-- HEADER --&gt;/m, '').replace(/&lt;!-- FOOTER --&gt;[^<]*/m, '')
        );
    }
};
