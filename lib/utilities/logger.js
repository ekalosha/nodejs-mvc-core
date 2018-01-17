
"use strict";

 /**
  * @author Sajera Serhii P. Perekhrest <allsajera@gmail.com>
  * @private
  * @class
  */
class Logger {

    /**
     * @description log
     * @example ( new Logger() ).log()
     * @function logger.log
     * @public
     */
    log () {
        console.log.apply(console, arguments);
    }

    /**
     * @description log information
     * @example ( new Logger() ).info()
     * @function logger.info
     * @public
     */
    info () {
        console.info.apply(console, arguments);
    }

    /**
     * @description log warning
     * @example ( new Logger() ).warn()
     * @function logger.warn
     * @public
     */
    warn () {
        console.warn.apply(console, arguments);
    }

    /**
     * @description log error
     * @example ( new Logger() ).error()
     * @function logger.error
     * @public
     */
    error () {
        console.error.apply(console, arguments);
    }

    /**
     * @description simpe log only for debug mode
     * @example ( new Logger() ).debug()
     * @function logger.debug
     * @public
     */
    debug () {
        if ( this.config.debug ) {
            console.info.apply(console, arguments);
        }
    }

    /**
     * @protected
     * @public
     */
    get config () {
        return require('./config').instance;
    }

}

/**
 * @description Initializing application logger before init
 * @private
 */
var instance = new Logger();

/**
 * @description public representation of logger module
 * @public
 */
module.exports = {
    /**
     * @description
     * @example
     class CustomLogger extends Logger {
        ...
     }
     * @public
     */
    get Logger () {
        return Logger
    },

    /**
     * @description
     * @example require('./path/to/logger').instance
     * @protected
     * @public
     */
    get instance () {
        return instance;
    },

    /**
     * @description to provide ability to customize origin loger
     * @param { Class } Logger - class inherited from a Logger
     * @public
     */
    replace: function ( CustomLogger ) {
        var tmp;
        if ( typeof CustomLogger == 'function' ) {
            tmp = new CustomLogger();
        }
        if ( tmp instanceof Logger  ) {
            instance = tmp;
        }
    }
};
