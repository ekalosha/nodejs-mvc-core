
// Using STRICT mode for ES6 features
"use strict";

var Core = require('../../../index.js');

/**
 * Importing Application Facade
 *
 * @type {ApplicationFacade|*}
 */
var applicationFacade = Core.ApplicationFacade.instance;

/**
 *  Web Init Module
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class WebInitModule extends Core.Bootstrap {

    /**
     * HTTP Server constructor
     */
    constructor () {
        // We must call super() in child class to have access to 'this' in a constructor
        super();
    }

    /**
     * Initialize server application
     */
    init () {
        // Inherit bindings to parents initialization
        super.init();

        this._logger.log('@@@@ Init server application');
        this.applicationFacade.model.loadModels(this.applicationFacade.basePath + "/app/models");

        // Loading module routes
        this.applicationFacade.server.loadRoutes('/app/routes');
    };

    /**
     * Running module
     */
    run () {
        this._logger.log('@@@@ Run Bootstrap module');
    };

    /**
     * Bootstrapping module
     */
    bootstrap () {
        super.bootstrap();

        this._logger.log('[WebInitModule] Bootstraping Module: ', this.name);
    };
}

module.exports = WebInitModule;