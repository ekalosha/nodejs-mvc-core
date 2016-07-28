
// Using STRICT mode for ES6 features
"use strict";

/**
 * Module dependencies.
 */

/**
 * Requiring core Events module
 */
var events = require('events');

/**
 * Path module
 */
var path = require('path');

/**
 * File systems module
 */
var fs = require('fs');

/**
 * Requiring Application configuration
 *
 * @type {exports|module.exports}
 */
var ApplicationConfig = require('./config.js').Configuration;

/**
 * Application Events
 *
 * @type {{SERVER_STARTED: string, HTTP_SERVER_READY: string, MONGO_CONNECTED: string, DATABASE_CONNECTED: string}}
 */
var ApplicationEvent = {
    SERVER_STARTED: 'SERVER_STARTED',
    HTTP_SERVER_READY: 'HTTP_SERVER_READY',
    DATABASE_CONNECTED: 'DATABASE_CONNECTED',
    MONGO_CONNECTED: 'MONGO_CONNECTED'
};

/**
 *  Application Facade. Initialize Application and Handles common Application data.
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class ApplicationFacade extends events.EventEmitter {

    /**
     * Facade constructor
     */
    constructor () {
        // We must call super() in child class to have access to 'this' in a constructor
        super();

        /**
         * Requiring system logger
         *
         * @type {Logger|exports|module.exports}
         * @private
         */
        this._logger = require('./logger.js');

        /**
         * Checking that current instance is not initialized yet
         */
        if (ApplicationFacade._instance != null) {
            throw new Error('Could not reinitialize ApplicationFacade.');
        }

        // Set base path of application
        this._basePath = path.dirname(process.mainModule.filename);
        this._logger.log('## Set base PATH of the application: ', this._basePath);

        /**
         * Application config
         *
         * @type {Configuration|exports|module.exports}
         * @private
         */
        this._config = new ApplicationConfig(this._basePath);

        /**
         * Modules Map
         *
         * @type {{}}
         * @private
         */
        this._modules = {};

        /**
         * Module Queue
         *
         * @type {[]}
         * @private
         */
        this._moduleQueue = [];

        /**
         * Flag shows that modules initialized
         *
         * @type {boolean}
         */
        this.isInitialized = false;

        /**
         * Objects registry
         *
         * @type {{}}
         * @private
         */
        var RegistryClass = require('./registry.js');
        this._registry = new RegistryClass();
    }

    /**
     * Static singleton instance of ApplicationFacade
     *
     * @return ApplicationFacade
     */
    static get instance () {
        if (ApplicationFacade._instance == null) {
            ApplicationFacade._instance = new ApplicationFacade();
        }

        return ApplicationFacade._instance;
    }

    /**
     * Returns base path of the application
     *
     * @returns String
     */
    get basePath (){
        return this._basePath;
    }

    /**
     * Returns Application Configuration
     *
     * @returns {*|Configuration|module.exports|*}
     */
    get config (){
        return this._config;
    }

    /**
     * Returns Objects Registry
     *
     * @returns {*|Registry|module.exports|*}
     */
    get registry () {
        return this._registry;
    }

    /**
     * Run application facade based on configuration settings
     */
    init () {

        // Pre-Initializing modules list
        this.preInitModules();

        // Initializing modules list
        this.initModules();
    }

    /**
     * Pre-Initialize Modules
     */
    preInitModules () {
        for (var i = 0; i < this._moduleQueue.length; i++) {
            var moduleName = this._moduleQueue[i].name;
            var moduleInstance = this._moduleQueue[i].module;

            this._logger.log("## Trying to pre-initialize module: ", moduleName);
            if (moduleInstance != null) {
                // Initializing module
                if (moduleInstance.preInit != null) {
                    moduleInstance.preInit();
                    this._logger.log("## Pre-Initialized module: ", moduleName);
                } else {
                    this._logger.log("## Pre-Initialize is not defined for module: %s. SKIPPING.", moduleName);
                }
            } else {
                this._logger.warn("## WARNING. Module is not set: ", moduleName);
            }
        }
    }

    /**
     * Initialize Modules
     */
    initModules () {
        for (var i = 0; i < this._moduleQueue.length; i++) {
            var moduleName = this._moduleQueue[i].name;
            var moduleInstance = this._moduleQueue[i].module;

            this._logger.log("## Trying to initialize module: ", moduleName);
            if (moduleInstance != null) {
                // Initializing module
                if (moduleInstance.init != null && !moduleInstance.isAlreadyInitialized) {
                    moduleInstance.init();
                    moduleInstance.isAlreadyInitialized = true;
                    this._logger.log("## Initialized module: ", moduleName);
                } else {
                    this._logger.log("## Initialize is not defined for module: %s. SKIPPING.", moduleName);
                }
            } else {
                this._logger.warn("## WARNING. Module is not set: ", moduleName);
            }
        }

        // Set this.isInitialized flag to true
        this.isInitialized = true;
    }

    /**
     * Loading models for some path
     *
     * @param modelsPath
     */
    loadModels (modelsPath) {
        //var normalizedPath = require("path").join(__dirname, '..', modelsPath);
        var normalizedPath = modelsPath;
        if (!fs.existsSync(normalizedPath)) {
            this._logger.info('## Models Dir is not exists %s. Trying another one.', normalizedPath);
            if (fs.existsSync(this.basePath + '/' + normalizedPath)) {
                normalizedPath = this.basePath + '/' + normalizedPath;
            }
        }

        normalizedPath = fs.realpathSync(normalizedPath);
        this._logger.info('## Get realpath of models directory: ', normalizedPath);

        this._logger.debug('---------- ---------- ---------- ---------- ---------- ---------- ---------- ----------');

        // Loading models
        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            if (file.indexOf('.js') != -1) {
                this._logger.info('Loading model: %s', modelsPath + '/' + file);
                require(normalizedPath + '/' + file);
            } else {
                this._logger.debug('    @@@@ File %s is not js file. Ignoring.', file);
            }
        }.bind(this));
    }

    /**
     * Loading modules from config file
     *
     * @param configName
     */
    loadModules (configName) {
        if (configName == null) configName = 'modules.json';

        var configPath = this.basePath + '/config/env/' + configName;
        if (!fs.existsSync(configPath)) {
            this._logger.info('## Applications config is not exists %s. Trying another one.', configPath);
            if (fs.existsSync(this.basePath + '/config/env/' + ApplicationConfig.envName + '-' + configName)) {
                configPath = this.basePath + '/config/env/' + ApplicationConfig.envName + '-' + configName;
            }
        }

        configPath = fs.realpathSync(configPath);
        this._logger.info('## Loading modules config file: ', configPath);

        this._logger.debug('---------- ---------- ---------- ---------- ---------- ---------- ---------- ----------');

        // Loading applications config
        this._modulesConfig = require(configPath);
        // this._logger.debug(this._modulesConfig);
        if (this._modulesConfig != null && this._modulesConfig.applications != null && this._modulesConfig.applications.length > 0) {
            for (var i = 0; i < this._modulesConfig.applications.length; i++) {
                var moduleInfo = this._modulesConfig.applications[i];
                var moduleName = moduleInfo.name;
                var ClassDefinition = null;
                try {
                    this._logger.log('#### Requiring application: %s (%s)', moduleName, moduleInfo.path);
                    ClassDefinition = require(moduleInfo.path);
                } catch (error) {
                    var modulePath = path.join(this.basePath, moduleInfo.path)
                    this._logger.warn('#### Failed to load application from default path. Retry from location: ', modulePath);
                    ClassDefinition = require(modulePath);
                }

                // Loading module
                this.load(moduleName, ClassDefinition)

                if (this.isInitialized) {
                    var moduleInstance = this[moduleName];

                    // Initializing Application
                    if (moduleInstance.init != null && typeof(moduleInstance.init) == "function") {
                        moduleInstance.init();
                        moduleInstance.isAlreadyInitialized = true;
                        this._logger.log("## Initialized module: ", moduleName);
                    } else {
                        this._logger.log("## Initialize is not defined for module: %s. SKIPPING.", moduleName);
                    }
                }
            }
        }
    }

    /**
     * Load module and register it
     *
     * @param moduleName
     * @param path
     */
    load(moduleName, path, className){

        var ModuleClass;
        if (path instanceof Function) {
            this._logger.debug('## Detecting module type for %s. Class-Function detected.', moduleName);
            ModuleClass = path;
        } else {
            this._logger.debug('## Detecting module type for %s. Local path detected \'%s\'', moduleName, path);
            ModuleClass = require(path);
        }

        // Initializing module
        var moduleInstance = new ModuleClass();

        // Set modules Map
        this._modules[moduleName] = moduleInstance;
        this._moduleQueue.push({name: moduleName, module: moduleInstance});
        this[moduleName] = moduleInstance;
    }

    /**
     * Run application facade based on configuration settings
     */
    run () {
        // Set ROOT for static files
        for (var i = 0; i < this._moduleQueue.length; i++) {
            var moduleName = this._moduleQueue[i].name;
            var moduleInstance = this._moduleQueue[i].module;
            this._logger.log("## Starting module: ", moduleName);
            if (moduleInstance != null) {
                // Running module
                if (moduleInstance.run != null) {
                    this._logger.log("## Running module: ", moduleName);
                    moduleInstance.run();
                } else {
                    this._logger.log("## Run is not defined for module: %s. SKIPPING.", moduleName);
                }
            } else {
                this._logger.warn("## WARNING. Module is not set: ", moduleName);
            }
        }
    };
}

/**
 * Initializing application facade before export
 */
module.exports.ApplicationEvent = ApplicationEvent;
module.exports.ApplicationFacade = ApplicationFacade;
