
// Using STRICT mode for ES6 features
"use strict";

/**
 * Requiring Core Library
 */
var Core = require('../../../../index.js');

/**
 *  Test API Class Controller
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class TestAPIController extends Core.Controllers.APIController {

    /**
     * Initializing controller
     *
     * @param callback
     */
    init (callback) {

        // Ignore two fields
        this._ignoredRequestFieldsMap = {isAdmin: true, isVerified: true};

        this._model = Core.ApplicationFacade.instance.model.collection("collection1");

        // Registering actions
        this.registerAction('action-one', 'loadActionOne');

        callback();
    }

    /**
     * Load Action "action-one"
     *
     * @param dataReadyCallback
     */
    loadActionOne (dataReadyCallback) {

        // Set page data
        this.data.status = "SUCCESS";
        this.data.controller = "TestAPIController";
        this.data.action = "loadActionOne";

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
exports = module.exports = TestAPIController;
