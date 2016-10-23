
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
        this._model = Core.ApplicationFacade.instance.model.collection("collection1");

        // Registering actions
        // this.registerAction('action-one', 'loadActionOne');

        callback();
    }

};

/**
 * Exporting Controller
 *
 * @type {Function}
 */
exports = module.exports = TestAPIController;
