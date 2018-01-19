
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
    get logger () {
        return require('./logger').instance;
    }

    /**
     * @description using istantiated config
     * @example this.config
     * @protected
     * @public
     */
    get config () {
        return require('./configuration').instance;
    }

    /**
     * @description global core event module
     * @example
        // firing
        this.coreEvent.emit(this.coreEvent.SERVER_STARTED, { ... } );
        // listen
        this.coreEvent.on(this.coreEvent.SERVER_STARTED, function () { ... } );
     * @protected
     * @public
     */
    get coreEvent () {
        return require('./coreevent').instance;
    }
}

typeof window != 'undefined' && (window.Utilities  = Utilities);

/**
 * @description connect common functionality within library
 * @private
 */
module.exports =  Utilities;