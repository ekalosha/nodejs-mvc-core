
"use strict";

/**
 * native Node.js modules
 */
const events = require('events');

/**
 * @description delegate common abilities within library
 * @author Sajera Serhii P. Perekhrest <allsajera@gmail.com>
 * @private
 * @class
 */
class Utilities extends events.EventEmitter {
    constructor () {
        super();
    }

    /**
     * @description using current logger
     * @example
        this.logger.debug('Some', 'message');
        this.logger.log('Some', 'message');
        this.logger.info('Some', 'message');
        this.logger.warn('Some', 'message');
        this.logger.error('Some', 'message');
     * @protected
     * @public
     */
    static get logger () {
        return require('./logger').instance;
    }

    /**
     * @description got config
     * @example this.config
     * @protected
     * @public
     */
    static get config () {
        return require('./config').instance;
    }

}

/**
 * Exporting model definition
 */
module.exports =  Utilities;
