
/**
 * implementation ModuleInterface
 * @ignore
 */
const ModuleBase = require('./modulebase');

/**
 * default module Logger
 * @ignore
 */
const Logger = require('./logger');

/**
 * default module Configuration
 * @ignore
 */
const Configuration = require('./configuration');

/**
 * default root module is http server
 * @ignore
 */
const HttpServer = require('./httpserver');

/**
 * utilities of library
 * @ignore
 */
const utils = require('../utilities/utilities'),
    handleAsAsync = utils.handleAsAsync,
    is = utils.is;

/**
 * @description
    Bootstrap application. Provide ability to customize bootstrapping.
    <br/><br/> <strong> Bootstrap </strong>
    <br/> 1. Extend Available modules if it necessary
    <br/> 2. Setup Logger
    <br/> 3. Setup Configuration
    <br/> 4. Setup Root module (HttpServer|CronServer|Cli)
    <br/> 5. Setup other modules {@link Bootstrap#initializeModules}
    <br/><br/>
 * @example
 * class MyBootstrap extends Core.Bootstrap {
 *  ...
 * }
 * Core.setupBootstrap(MyBootstrap);
 * Core.initialize();
 * @author Sajera <allsajera@gmail.com>
 * @implements {ModuleInterface}
 * @classdesc Core.Bootstrap
 * @see {@link ModuleBase}
 * @alias Bootstrap
 * @param {Object} options - any type and any count of arguments to deleagetet from Core.initialize({options});
 * @public
 * @class
 */
class Bootstrap extends ModuleBase {
    /**
     * @constructor
     */
    constructor () {
        // this
        super();
        /**
         * @description Correct access to Core.instance. Must wait until Core will be created.
         * @type {Core}
         * @readonly
         * @private
         */
        this.core = require('../core').instance;
    }

    /**
     * @description ablility to replace default logger
     * @example
     * class MyLogger extends Core.Logger {
     *  ...
     * }
     * ...
     * class MyBootstrap extends Core.Bootstrap {
     *  constructor () {
     *      super();
     *      this.logger = MyLogger;
     *  }
     * }
     * @param {Logger} CustomLogger
     * @see {@link Logger}
     * @type {Logger}
     * @public
     */
    set logger ( CustomLogger ) {
        if (is.function(CustomLogger) && (new CustomLogger()) instanceof Logger) {
            // store current logger module
            this.CurrentLogger = CustomLogger;
        } else {
            this.logger.error(`
                Unsuccessful attempt to replace the logger was detected.
                Should be:
                class ${CustomLogger.name} extends Core.Logger {
                    ...
                }
            `);
        }
    }

    /**
     * @description ablility to replace default config
     * @example
     * class MyConfiguration extends Core.Configuration {
     *  ...
     * }
     * ...
     * class MyBootstrap extends Core.Bootstrap {
     *  constructor () {
     *      super();
     *      this.config = MyConfiguration;
     *  }
     * }
     * @param {Configuration} CustomConfiguration
     * @see {@link Configuration}
     * @type {Configuration}
     * @public
     */
    set config ( CustomConfiguration ) {
        if (is.function(CustomConfiguration) && (new CustomConfiguration('instanceOf')) instanceof Configuration) {
            // store current Configuration module
            this.CurrentConfiguration = CustomConfiguration;
        } else {
            this.logger.error(`
                Unsuccessful attempt to replace the config was detected.
                Should be:
                class ${CustomConfiguration.name} extends Core.Configuration {
                    ...
                }
            `);
        }
    }

    /**
     * @description
        <br/> Availabel Core root modules {@link: HttpServer}, {@link: CronServer}, {@link: Cli}.
        <br/> Ablility to replace default root module (HttpServer)
        <strong> Advanced knowledge </strong> You may create your own Root Module for Core.
     * @example
     * class MyBootstrap extends Core.Bootstrap {
     *  constructor () {
     *      super();
     *      this.root = Core.HttpServer;
     *  }
     * }
     * @param {ModuleBase} CustomRoot
     * @see {@link ModuleBase}
     * @type {ModuleBase}
     * @public
     */
    set root ( CustomRoot ) {
        if (is.function(CustomRoot) && (new CustomRoot('instanceOf')) instanceof ModuleBase) {
            // store current Configuration module
            this.CurrentRoot = CustomRoot;
        } else {
            this.logger.error(`
                Unsuccessful attempt to replace the HttpServer was detected.
                Should be:
                class ${CustomRoot.name} extends Core.ModuleBase {
                    ...
                }
            `);
        }
    }
    /**
     * @description
        Bootstrap initialization <strong> last step </strong>
        <br/> Last step of initialization Core aplication.
        <br/> You may define your own modules or helpers initialization within the Core.
        <br/> You may use async or promise for implementation
        <br/><br/>
     * @param {function} callback - for using async way
     * @private
     */
    initializeModules ( callback ) {
        // this.core = Core.instance;
        callback();
    }

    /**
     * @description
        Bootstrap module has async initialization.
        <br/> This flow has important things.
        And it <strong> can't </strong> be overridden.
        <br/><br/> <strong> Bootstrap initialization </strong>
        <br/> 1. Setup Logger
        <br/> 2. Setup Configuration
        <br/> 3. Setup Root module (HttpServer|CronServer|Cli)
        <br/> 4. Setup other modules (initializeModules)
        <br/><br/>
     * @param {function} callback
     * @private
     */
    initialize ( callback ) {
        let _Logger = this.CurrentLogger || Logger;
        let _Root = this.CurrentRoot || HttpServer;
        let _Configuration = this.CurrentConfiguration || Configuration;
        // 1 step - initialize Logger
        handleAsAsync(_Logger.create.bind(_Logger), error => {
            if ( error ) { callback(error); } else {
                const logger = _Logger.instance;
                this.core.logger = logger;
                // 2 step - initialize Configuration
                handleAsAsync(_Configuration.create.bind(_Configuration), error => {
                    if ( error ) { callback(error); } else {
                        const config = _Configuration.instance;
                        this.core.config = config;
                        // 3 step - initialize root module (HttpServer|CronServer|Cli)
                        handleAsAsync(_Root.create.bind(_Root), error => {
                            if ( error ) { callback(error); } else {
                                const root = _Root.instance;
                                this.core.root = root;
                                // 4 step - initialize other modules
                                handleAsAsync(this.initializeModules.bind(this), error => {
                                    if ( error ) {callback(error);}
                                    else {callback();}
                                });
                            }
                        });
                    }
                });
            }
        });
    }

}

/**
 * exports Bootstrap
 */
module.exports = Bootstrap;