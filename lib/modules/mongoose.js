
// Using STRICT mode for ES6 features
"use strict";

/**
 * Requiring core Events module
 */
var events = require('events');

/**
 * Requiring application Facade
 */
var applicationFacade = require('../facade.js').ApplicationFacade.instance;
var ApplicationEvent = require('../facade.js').ApplicationEvent;

/**
 *  Mongoose module. Handle Mongoose connection(s) and DB abstractions.
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class MongooseModule extends events.EventEmitter {

    /**
     * MongooseModule constructor
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
        this._logger = require('../logger.js');
        this._logger.log('## Initializing Mongoose Module');

        /**
         * Mongoose connection
         *
         * @type {*|exports|module.exports|*}
         * @private
         */
        this._mongoseConnection = null;

        /**
         * Mongoose instance
         *
         * @type {*|exports|module.exports|*}
         * @private
         */
        this._mongoose = require('mongoose');
    }

    /**
     * Returns Mongoose Instance
     *
     * @returns {*|mongoose|module.exports|*}
     */
    get mongoose (){
        return this._mongoose;
    }

    /**
     * Initialize mongoose based on configuration settings
     */
    init () {
        // Initializing mongoose
        this._logger.log("## Connecting to Mongo: ", applicationFacade.config.env.MONGODB_URL);
        this._mongoose.connect(applicationFacade.config.env.MONGODB_URL);

        // Handling connect event
        this._mongoose.connection.on('connected', () => {
            this._logger.info('#### Successfully connected to MongoDB server');
            applicationFacade.emit(ApplicationEvent.MONGO_CONNECTED);
            applicationFacade.emit(ApplicationEvent.DATABASE_CONNECTED);
        });

        // Handling error event
        this._mongoose.connection.on('error', () => {
            this._logger.error('#### Failed to connect to MongoDB server');
        });

        // Handling disconnect event
        this._mongoose.connection.on('disconnected', () => {
            this._logger.warn('#### Warning application disconnected from the MongoDB server');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', () => {
            this.mongoose.connection.close(() => {
                this._logger.error('#### [SIGINT] Mongoose default connection disconnected through application termination');
                process.exit(0);
            });
        });
    }

}

/**
 * Exporting module
 */
module.exports = MongooseModule;
