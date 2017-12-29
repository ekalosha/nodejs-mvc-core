
"use strict";

/**
 * native Node.js modules
 */
const fs = require('fs');
const path = require('path');

 /**
  * @class Configuration
  * @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
  * @private
  */
class Configuration {

    constructor () {
        this.init();
        
    }
    
    init () {
        // Load dotenv environment
        var options = {
            path: './config/' + this.envName
        };
        if (this.envName == 'default') {
            options.silent = true;
        }
        require('dotenv').config(options);
        // Initialize config
        var basePath = path.dirname(process.mainModule.filename);
        var configFileName = basePath + '/config/' + Configuration.envName + '.json';
        if (!fs.existsSync(configFileName)) {
            this.logger.warn('#### Environment configuration files are not exists: ', configFileName);
            configFileName = basePath + '/config/' + Configuration.envName + '.js';
        }

        this.logger.log('#### Trying to load configuration: ', configFileName);
        if (fs.existsSync(configFileName)) {
            Configuration._CONFIG = require(configFileName);
        } else {
            this.logger.error('#### Environment configuration files are not exists: ', configFileName);
        }
    }
    
    /**
     * @description current actual instance of Logger injected inside instances
     * @private
     */
    get logger () {
        return require('./logger').get();
    }





    /**
     * Get configuration values
     *
     * @returns {*}
     */
    get env () {
        if ( !this.env ) {
            
        }
        return this.__env;
    }

    /**
     * Check debug flag
     *
     * @returns {Boolean}
     */
    get isDebug () {
        return (this.__env.ENV_TYPE == 'dev') || (this.__env.ENV_TYPE == 'qa');
    }

    /**
     * Check is curren Environment is Dev
     *
     * @returns {Boolean}
     */
    get isDev () {
        return (this.__env.ENV_TYPE == 'dev');
    }

    /**
     * Check is curren Environment is QA
     *
     * @returns {Boolean}
     */
    get isQA () {
        return (this.__env.ENV_TYPE == 'qa');
    }

    /**
     * Returns name of current environment
     *
     * @returns {*|string}
     */
    static get envName () {
        return process.env.APPLICATION_ENV || process.env.NODE_ENV || 'development';
    }

}

var instance = null;
var Config = Configuration;

/**
 * @description public representation of logger module
 * @private
 */
module.exports = {
    
    Configuration: Configuration,
    
    /**
     * @description initialize configuration 
     * @returns { Object }
     * @private
     */
    init () {
        if ( instance ) {
            instance.logger.error('Configuration already installed');
        } else {
            return instance = new Config();
        }
    },
    
    /**
     * @description
     * @returns { Object } current instance of Logger 
     * @protected
     * @private
     */
    get () {
        return instance;
    },
    
    /**
     * @description to provide ability to customize origin Configuration
     * @param { Class } CustomConfiguration
     * @private
     */
    set ( CustomConfiguration ) {
        if ( instance ) {
            instance.logger.error('Installation of custom configuration is possible only prior to initialization');
        }
        if ( typeof CustomConfiguration == 'function' && ( new CustomConfiguration() ) instanceof Configuration  ) {
            Config = CustomConfiguration;
        } else {
            logger.get().error('To set custom configuration you must use inheritance from core.Configuration', 'expect Class got ', CustomConfiguration);
        }
    }
};
