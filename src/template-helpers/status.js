var Handlebars = require('handlebars');

module.exports = {
    status: function (options) {
        let className;
        let text;
        switch (options.hash.status) {
            case 'wip':
                className = 'sg-status--wip';
                text = 'work in progress';
                break;
            default:
                return;
        }
        return new Handlebars.SafeString(
            `<div class="sg-status__container"><div class="sg-status ${className}">${text}</div></div>`
        );
    }
};
