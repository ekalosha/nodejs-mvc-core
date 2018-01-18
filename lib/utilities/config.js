
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
        // dirname with config files
        this.configDir = 'config';

        // initialize configuration
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
        // Unset configuration
        // Configuration._CONFIG = {};

        // Load environment
        this.loadEnvironment();
        // Initialize config
        var main = path.dirname(process.mainModule.filename);
        var configPath = path.join(main, this.configDir, this.envName);
        this.logger.debug('#### Trying to load configuration:', configPath);

        if ( fs.existsSync(configPath) ) {
            var configData = require(configFileName);
            Object.assign(this, configData);
            this.logger.debug('#### Configuration loaded:\n', configData);
        }
        // Initialize config
        // let basePath = path.dirname(process.mainModule.filename);
        // let configFileName = basePath + '/config/' + Configuration.envName + '.json';
        // if (!fs.existsSync(configFileName)) {
        //     console.warn('#### Environment configuration files are not exists: ', configFileName);
        //     configFileName = basePath + '/config/' + Configuration.envName + '.js';
        // }

        // console.log('#### Trying to load configuration: ', configFileName);
        // if (fs.existsSync(configFileName)) {
        //     Configuration._CONFIG = require(configFileName);
        // } else {
        //     console.error('#### Environment configuration files are not exists: ', configFileName);
        // }
    }

    /**
     * @description load Environment and extend process.env variables
     * @example this.loadEnvironment();
     * @private
     */
    loadEnvironment () {
        // absolute path to root process dir
        var main = path.dirname(process.mainModule.filename);
        // absolute path to default ".env"
        var dfaultEnv = '.env';
        // absolute path to default "{NODE_ENV}.env"
        var envPath = this.envName+'.env';
        // absolute path to config dirrectory "{NODE_ENV}.env"
        var customPath = path.join(this.configDir, envPath);
        // choose by priority
        var pathToEnv = fs.existsSync( path.join(main, customPath) ) ? customPath
            : fs.existsSync( path.join(main, envPath) ) ? envPath
            : fs.existsSync( path.join(main, dfaultEnv) ) ? dfaultEnv : null;

        if ( pathToEnv ) {
            // read
            var env = Configuration.environment( pathToEnv );
            // add to process env
            Object.assign(process.env, env);
        }
        this.logger.debug('#### Environment configuration:\n', process.env);
    }

    /**
     * @description env parser
     * @example Configuration.environment('path/to/file');
     * @param { String } pathToEnv
     * @returns { Object }
     * @private
     */
    static environment ( envPath ) {
        var results = {};
        // can be iserted absolute path
        var filePath = fs.existsSync(envPath) ? envPath
            // "{pathToEnv}.env" within absolute path to root process directory
            : path.join(path.dirname(process.mainModule.filename), envPath);
        // read and parse .env file
        if ( fs.existsSync(filePath) ) {
            // try {
            let source = fs.readFileSync(filePath, 'utf8', 'r'),
            field, value, key = 0, lines = String( source ).split('\n');
            for ( ; (key < lines.length)&&lines[ key ]; key ++ ) {
                field = lines[ key ].match(/^\s*([\w\.\-\$\@\#\*\!\~]+)\s*=+/)[1];
                value = lines[ key ].match(/=\s*(.*)\s*$/)[1].trim();
                if ( field ) results[ field ] = value.replace(/(^['"]|['"]$)/g, '').replace(/\s+/,' ');
            }
            // } catch ( e ) {}
        }
        return results;
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
     * @protected
     * @public
     */
    get Configuration () {
        return Configuration;
    },

    /**
     * @description
     * @example require('./path/to/config').instance
     * @protected
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
