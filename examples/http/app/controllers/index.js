
// Using STRICT mode for ES6 features
"use strict";

/**
 * Requiring Core Library
 */
var Core = require('../../../../index.js');

/**
 *  Test Class Controller
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class IndexController extends Core.Controller {

    /**
     * Initializing controller
     *
     * @param callback
     */
    init (callback) {
        // Registering actions
        this.registerAction('action-one', 'loadActionOne');
        this.registerAction('exception', 'collection1Exception');

        callback();
    }

    /**
     * Load view file
     *
     * @param dataReadyCallback
     */
    load (dataReadyCallback) {

        // Set page data
        this.data.controller = "IndexController";
        this.data.status = "SUCCESS";

        this.view(Core.View.jsonView());

        // Send DATA_READY event
        dataReadyCallback(null);
    }

    /**
     * Load view file
     *
     * @param dataReadyCallback
     */
    loadActionOne (dataReadyCallback) {

        // Set page data
        this.data.status = "SUCCESS";
        this.data.controller = "IndexController";
        this.data.action = "loadActionOne";

        this.view(Core.View.jsonView());

        // Send DATA_READY event
        dataReadyCallback(null);
    }

    /**
     * collection1Exception
     *
     * @param dataReadyCallback
     */
    collection1Exception (dataReadyCallback) {

        var collection1 = Core.ApplicationFacade.instance.model.collection('collection1');
        var allItemsPromise = collection1.getAll();

        // Set page data
        this.data.status = "SUCCESS";
        this.data.controller = "IndexController";
        this.data.action = "collection1Exception";

        this.view(Core.View.jsonView());

        // Send DATA_READY event
        dataReadyCallback(null);
    }
};

/**
 * Exporting Controller
 *
 * @type {Function}
 */
exports = module.exports = IndexController;
