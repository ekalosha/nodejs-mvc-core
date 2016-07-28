
// Using STRICT mode for ES6 features
"use strict";

/**
 * Requiring core Events module
 */
var events = require('events');

/**
 * Requiring application Facade
 */
var applicationFacade = require('./facade.js').ApplicationFacade.instance;
var ApplicationEvent = require('./facade.js').ApplicationEvent;

/**
 *  Bootstrap class for NPM Modules
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class Bootstrap extends events.EventEmitter {

    /**
     * Module bootstrap constructor
     */
    constructor () {
        // We must call super() in child class to have access to 'this' in a constructor
        super();

        /**
         * Application config
         *
         * @type {Configuration|exports|module.exports}
         * @private
         */
        this._config = applicationFacade.config;

        /**
         * Requiring system logger
         *
         * @type {Logger|exports|module.exports}
         * @private
         */
        this._logger = require('./logger.js');

        /**
         * Application facade
         *
         * @type {ApplicationFacade}
         */
        this.applicationFacade = applicationFacade;

        /**
         * Module name/version
         *
         * @type {null}
         * @private
         */
        this._moduleName = null;
        this._moduleVersion = null;
    }

    /**
     * Getter for system logger
     *
     * @returns {*}
     */
    get logger () {
        return this._logger;
    }

    /**
     * Getter for config
     *
     * @returns {*}
     */
    get config () {
        return this._config;
    }

    /**
     * Flag which shows that the module is loadable
     *
     * @returns {boolean}
     */
    static get isLoadable () {
        return true;
    }

    /**
     * Returns name of module Loader
     */
    get name () {
        var result = this.constructor.name;

        if (this._moduleName != null) {
            result = this._moduleName;

            if (this._moduleVersion != null) {
                result = result + ' (v. ' + this._moduleVersion + ')';
            }
        }

        return result;
    }

    /**
     * Pre-Initializing module configuration
     */
    preInit () {
        this._logger.log('#### Pre-Initializing Module: ', this.name);
    }

    /**
     * Initializing module configuration
     */
    init () {
        this._logger.log('#### Initializing Module: ', this.name);

        // Bind to ApplicationEvent.DATABASE_CONNECTED event
        this.applicationFacade.on(ApplicationEvent.DATABASE_CONNECTED, function(event){
            "use strict";

            this.bootstrap();
        }.bind(this));
    }

    /**
     * Bootstrapping module
     */
    bootstrap () {
        this._logger.log('#### Bootstraping Module: ', this.name);
    };

    /**
     * Run module based on configuration settings
     */
    run () {
        this._logger.log('#### Running Module: ', this.name);
    };
}

/**
 * Exporting Module Bootstrapper
 */
module.exports = Bootstrap;
