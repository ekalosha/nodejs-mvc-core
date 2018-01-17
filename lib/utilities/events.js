
"use strict";

/**
 * native Node.js modules
 */
const events = require('events');

/**
 * @description Application Events
 * @name EVENTS
 * @type {{SERVER_STARTED: string, HTTP_SERVER_READY: string, MONGO_CONNECTED: string, DATABASE_CONNECTED: string}}
 */
const EVENTS = {
    LOG: 'LOG',
    SERVER_STARTED: 'SERVER_STARTED',
    HTTP_SERVER_READY: 'HTTP_SERVER_READY',
    DATABASE_CONNECTED: 'DATABASE_CONNECTED',
    MONGO_CONNECTED: 'MONGO_CONNECTED'
};

/**
 * @description Application Global EventBus
 * @author Sajera Serhii P. Perekhrest <allsajera@gmail.com>
 * @private
 * @class
 */
class EventBus extends events.EventEmitter {

    constructor () {
        super();

        /**
         * @alias EVENTS
         * @see EventEmitter - https://nodejs.org/docs/latest/api/events.html
         * @example
            // firing
            this.event.emit(this.event.SERVER_STARTED, { ... } );
            // listen
            this.event.on(this.event.SERVER_STARTED, function () { ... } );
         */
        Object.assign(this, EVENTS);
    }

}

/**
 * @description global Core EvntBus instance
 * @private
 */
 var instance = new EventBus();

 /**
  * @description public representation of events module
  * @public
  */
 module.exports = {
     /**
      * @description
      * @example
      class CustomEventBus extends EventBus {
         ...
      }
      * @public
      */
     get EventBus () {
         return EventBus;
     },

     /**
      * @description
      * @example require('./path/to/events').instance
      * @protected
      * @public
      */
     get instance () {
         return instance;
     },

     /**
      * @description to provide ability to customize origin eventBus
      * @param { Class } EventBus - class inherited from a EventBus
      * @public
      */
     replace: function ( CustomEventBus ) {
         var tmp;
         if ( typeof CustomEventBus == 'function' ) {
             tmp = new CustomEventBus();
         }
         if ( tmp instanceof EventBus  ) {
             instance = tmp;
         }
     }
 };
