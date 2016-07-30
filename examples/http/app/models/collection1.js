
// Using STRICT mode for ES6 features
"use strict";

/**
 * Requiring Core Library
 */
var Core = require('../../../../index.js');


/**
 *  Abstract model. Define main collection interface.
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 *  @abstract
 */
class Collection1 extends Core.Model.AbstractModel {
    /**
     * Collection constructor
     */
    constructor (collectionName) {
        // We must call super() in child class to have access to 'this' in a constructor
        super();

        console.log("Initializing model: %s", collectionName);
    }

    /**
     * Initialize collection
     */
    init () {
        ;
    }
}

/**
 * Exporting model definition
 */
module.exports =  Collection1;
