
// Using STRICT mode for ES6 features
"use strict";

/**
 * Requiring DotEnv and get configuration for the project
 */
var defaultConfig = {
    silent: true
}
if (global.DEFAULT_CONFIG_PATH != null) {
    defaultConfig['path'] = global.DEFAULT_CONFIG_PATH;
}
require('dotenv').config(defaultConfig);

/**
 *  Base Application configuration
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class Configuration {

    /**
     * Default constructor
     */
    constructor () {
        this._configuration = process.env;
    }

    /**
     * Get configuration values
     *
     * @returns {*}
     */
    get env () {
        return this._configuration;
    }

    /**
     * Check debug flag
     *
     * @returns {Boolean}
     */
    get isDebug () {
        return (this._configuration.ENV_TYPE == 'dev') || (this._configuration.ENV_TYPE == 'qa');
    }

    /**
     * Check is curren Environment is Dev
     *
     * @returns {Boolean}
     */
    get isDev () {
        return (this._configuration.ENV_TYPE == 'dev');
    }

    /**
     * Check is curren Environment is QA
     *
     * @returns {Boolean}
     */
    get isQA () {
        return (this._configuration.ENV_TYPE == 'qa');
    }

    /**
     * Returns name of current environment
     *
     * @returns {*|string}
     */
    static get envName () {
        return process.env.APPLICATION_ENV || process.env.NODE_ENV || 'default';
    }

    /**
     * Load environment and init config
     */
    static loadEnvironment () {
        var options = {
            path: './config/env/' + this.envName
        };
        if (this.envName == 'default') {
            options.silent = true;
        }
        require('dotenv').config(options);
    }
}

// Load specified environment
Configuration.loadEnvironment();

module.exports.Configuration = Configuration;
