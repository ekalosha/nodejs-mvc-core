
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
 * Require Async operations helper
 *
 * @type {exports|module.exports}
 */
var async = require("async");

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

        var collection1 = this.applicationFacade.model.collection("collection1");
        async.series([
            asyncCallback => {
                var collection1Object = {
                    "token": "Hfbndhs-9485nj-fhdk",
                    "password": "PWD",
                    "email": "some@email.com",
                    "isAdmin" : false,
                    "isVerified" : false,
                    "firstName": "Tester",
                    "lastName": "Collectionist",
                    "notifications": ["Type1", "Type2"]
                };
                collection1.insert(collection1Object, (error, item) => {
                    if (error) {
                        console.error("Failed to insert item!");
                        return asyncCallback(error);
                    }

                    console.log("New item [%s]", item.id);
                    asyncCallback();
                });

            },
            asyncCallback => {
                collection1.getList({}, null, null, {createdAt: -1}, (error, items) => {
                    if (error) {
                        console.error("Failed to list items!");
                        return asyncCallback(error);
                    }

                    console.log("Items count: %s", items.length);
                    asyncCallback();
                });
            }
        ], (error) => {
            if (error) {
                // Something went wrong. Action is failed.
            } else {
                // OK
            }
        });



        this._logger.log('[WebInitModule] Bootstraping Module: ', this.name);
    };
}

module.exports = WebInitModule;