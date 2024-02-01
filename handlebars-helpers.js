const Handlebars = require('handlebars');

Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
});

module.exports = Handlebars;
