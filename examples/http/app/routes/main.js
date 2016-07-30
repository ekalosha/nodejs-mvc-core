
// Using STRICT mode for ES6 features
"use strict";

module.exports = function () {
    var routes = {
        'all|/': 'index.js',
        'all|/:action': 'index.js',
    };

    return routes;
};
