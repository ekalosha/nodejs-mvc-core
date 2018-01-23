
"use strict";

/**
 * native Node.js modules
 */

/**
 * lib modules
 */
var Utilities = require('./utilities/utilities');

/**
 * @description Root output
 * @author Sajera Serhii P. Perekhrest <allsajera@gmail.com>
 * @public
 * @class
 */
class Core extends Utilities {
    constructor () {
        super()

        /**
         * @description log event
         * @example Core.emit(Core.EVENT.LOG, { ... });
         * @event LOG
         * @public
         */
        this.coreEvent.on(
            this.coreEvent.LOG,
            // TODO improve logic
            () => this.logger.apply(this.logger, Array.prototype.slice.call(arguments, 0))
        );
    }

    /**
     * @example Core.instance
     * @public
     */
    static get instance () {
        return instance;
    }

    /**
     * @example Core.on(Core.EVENT.LOG, () => { ... })
     * @public
     */
    static get on () {
        return instance.coreEvent.on.bind(instance.coreEvent);
    }

    /**
     * @example Core.emit(Core.EVENT.LOG, { ... })
     * @public
     */
    static get emit () {
        return instance.coreEvent.emit.bind(instance.coreEvent);
    }

    /**
     * @example Core.EVENT
     * @public
     */
    static get EVENT () {
        return instance.coreEvent;
    }

    /**
     * @description alias for Core.Logger.instance
     * @example Core.logger
     * @public
     */
    static get logger () {
        return instance.logger;
    }

    /**
     * @example Core.Logger
     * @public
     */
    static get Logger () {
        return require('./utilities/logger');
    }

    /**
     * @description alias for Core.Configuration.instance
     * @example Core.config
     * @public
     */
    static get config () {
        return instance.config;
    }

    /**
     * @example Core.Configuration
     * @public
     */
    static get Configuration () {
        return require('./utilities/configuration');
    }

}

/**
 * Alias
 */
var instance = new Core();

/**
 * @description public representation Core
 * @public
 */
module.exports = Core;
