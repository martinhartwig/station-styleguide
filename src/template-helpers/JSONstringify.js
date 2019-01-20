/**
 * Stringify an object using `JSON.stringify`.
 *
 * @param  {Object} `obj` Object to stringify
 * @return {String}
 * @api public
 */
module.exports = {
    'json-stringify': function (obj, options) {
        if (!obj) {
            obj = {};
            // console.log( 'no obj given', obj);
        }
        if (!options.hash.indent) {
            indent = 0;
        } else {
            indent = options.hash.indent
        }

        return JSON.stringify(obj, null, indent);
    }
};
