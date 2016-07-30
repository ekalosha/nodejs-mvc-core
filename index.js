
// Using STRICT mode for ES6 features
"use strict";

/**
 * Initializing application facade before export
 */
module.exports = {
    ApplicationEvent: require('./lib/facade.js').ApplicationEvent,
    ApplicationFacade: require('./lib/facade.js').ApplicationFacade,
    Bootstrap: require('./lib/bootstrap.js'),
    Controller: require('./lib/controller.js').Controller,
    Error: {
        BaseError: require('./lib/error/error.js'),
        HTTPError: require('./lib/error/httperror.js'),
        LoaderError: require('./lib/error/loadererror.js')
    },
    ExecutionState: require('./lib/controller.js').ExecutionState,
    Logger: require('./lib/logger.js'),
    Model: {
        AbstractModel: require('./lib/model/abstractmodel.js'),
    },
    Modules: {
        HTTPServer: require('./lib/modules/httpserver.js'),
        Mongoose: require('./lib/modules/mongoose.js')
    },
    ModuleView: require('./lib/view/moduleview.js').ModuleView,
    ViewType: require('./lib/view/view.js').ViewType,
    View: require('./lib/view/view.js').View
};
