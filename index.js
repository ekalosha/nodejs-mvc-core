
// Using STRICT mode for ES6 features
"use strict";

/**
 * Initializing application facade before export
 */
module.exports = {
    ApplicationEvent: require('./lib/facade.js').ApplicationEvent,
    ApplicationFacade: require('./lib/facade.js').ApplicationFacade,
    Bootstrap: require('./lib/bootstrap.js'),
    Error: {
        BaseError: require('./lib/error/error.js'),
        HTTPError: require('./lib/error/httperror.js'),
        LoaderError: require('./lib/error/loadererror.js')
    },
    Logger: require('./lib/logger.js'),
    Modules: {
        HTTPServer: require('./lib/modules/httpserver.js'),
        Mongoose: require('./lib/modules/mongoose.js')
    }
};
