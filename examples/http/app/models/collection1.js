
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
 */
class Collection1 extends Core.Model.MongooseModel {
    /**
     * Collection constructor
     */
    constructor (collectionName) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(collectionName);

        console.log("New Model: %s", this.collectionName);
    }

    /**
     * Initialize collection
     */
    init () {
        console.log("Initializing model: %s", this.collectionName);

        // Init schema definition
        var schemaDefinition = {
            "token": String,
            "password": String,
            "email": String,
            "isAdmin" : Boolean,
            "createdAt" : {
                type: Date,
                "default": Date.now
            },
            "modifiedAt" : {
                type: Date,
                "default": Date.now
            },
            "isVerified" : Boolean,
            "firstName": String,
            "lastName": String,
            notifications: []
        };

        // Creating schema
        this.createSchema(schemaDefinition);
    }
}

/**
 * Exporting model definition
 */
module.exports =  Collection1;
