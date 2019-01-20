var Handlebars = require('handlebars');

function getPartialFromReferences(partialName, references) {
    return references.find(function(partials){
        return partials.partialName === partialName;
    });
}
function printRefs(partialNames, references) {
    return partialNames.map(function(partialName){
        var partial = getPartialFromReferences(partialName, references);
        if (!partial) {
            return '-';
        }
        return '<li><small>' + partial.category + '/</small><a href="../../' + _getFullPathFromPartial(partial) + '-page.html" target="_top">{{> ' + partial.partialName + '}}</a></li>'
    }).join("\n");
}
function _getFullPathFromPartial(partial) {
    return partial.partialPath + '/' + partial.partialName;
}
function _getPartialCategory(partial) {
    return partial.partialPath;
}

module.exports = {
    usesPartials: function (options) {
        if (options.hash.partialName && options.hash.allPartials) {
            return new Handlebars.SafeString(
                options.hash.allPartials.filter(function(partials){
                    return partials.partialName === options.hash.partialName;
                })/*.sort(function(a, b){
                    return _getFullPathFromPartial(a) < _getFullPathFromPartial(b);
                })*/.map(function(partials, idx){
                    return printRefs(partials.references.sort(function(a, b){
                        return _getFullPathFromPartial(getPartialFromReferences(a, options.hash.allPartials)) > _getFullPathFromPartial(getPartialFromReferences(b, options.hash.allPartials));
                    }), options.hash.allPartials);
                }).join("\n") || '-'
            );
        }
        return '';
    },
    usedByPartials: function (options) {
        if (options.hash.partialName && options.hash.allPartials) {
            return new Handlebars.SafeString(
                printRefs(
                    options.hash.allPartials.filter(function(partials){
                        return partials.references.find(function(ref) {
                            return ref === options.hash.partialName;
                        });
                    }).map(function(partial){
                        return partial.partialName;
                    }).sort(function(a, b){
                        return _getFullPathFromPartial(a) > _getFullPathFromPartial(b);
                    }),
                    options.hash.allPartials
                ) || '-'
            );
        }
        return '';
    }
};
