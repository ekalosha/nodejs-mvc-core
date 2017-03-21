
// Using STRICT mode for ES6 features
"use strict";

module.exports = function () {
    var routes = {
        'all|/collection1s': 'api.js',
        'all|/collection1s/:id': 'api.js',
        'all|/': 'index.js',
        'all|/:action': 'index.js',
    };

    return routes;
};
