
"use strict";

/**
 * native Node.js modules
 */
const fs = require('fs');
const path = require('path');

 /**
  * @author Sajera Serhii P. Perekhrest <allsajera@gmail.com>
  * @private
  * @class
  */
class Configuration {

    constructor () {
        // defaults
        this.DEBUG = true;

        // initialize
        this.init();
    }

    /**
     * @protected
     * @public
     */
    get envName () {
        return process.env.APPLICATION_ENV || process.env.NODE_ENV || 'development';
    }

    /**
     * @description current actual instance of logger injected inside instances
     * @protected
     * @public
     */
    get logger () {
        return require('./logger').instance;
    }

    /**
     * @description mostly for debug method of logger
     * @protected
     * @public
     */
    get debug () {
        if ( this.DEBUG || process.env.DEBUG ) {
            return true;
        } else return false;
    }

    init () {
        // Load dotenv environment
        // var options = {
        //     path: './config/' + this.envName
        // };
        // if (this.envName == 'default') {
        //     options.silent = true;
        // }
        // require('dotenv').config(options);
        // // Initialize config
        // var basePath = path.dirname(process.mainModule.filename);
        // var configFileName = basePath + '/config/' + Configuration.envName + '.json';
        // if (!fs.existsSync(configFileName)) {
        //     this.logger.warn('#### Environment configuration files are not exists: ', configFileName);
        //     configFileName = basePath + '/config/' + Configuration.envName + '.js';
        // }
        //
        // this.logger.log('#### Trying to load configuration: ', configFileName);
        // if (fs.existsSync(configFileName)) {
        //     Configuration._CONFIG = require(configFileName);
        // } else {
        //     this.logger.error('#### Environment configuration files are not exists: ', configFileName);
        // }
    }


}

/**
 * @description Initializing application config before init
 * @private
 */
var instance = { DEBUG: true };
// safe Initialize
try { instance = new Configuration(); } catch ( error ) {}

/**
 * @description public representation of config module
 * @public
 */
module.exports = {
    /**
     * @description
     * @example
        class CustomConfig extends Config {
            ...
        }
     * @public
     */
    Configuration: Configuration,

    /**
     * @description
     * @example require('./path/to/config').instance
     * @public
     */
     get instance () {
         return instance;
     },

     /**
      * @description to provide ability to customize origin loger
      * @param { Class } Configuration - class inherited from a Config
      * @public
      */
     replace: function ( CustomConfiguration ) {
         var tmp;
         if ( typeof CustomConfiguration == 'function' ) {
             tmp = new CustomConfiguration();
         }
         if ( tmp instanceof Configuration  ) {
             instance = tmp;
         }
     }
};
