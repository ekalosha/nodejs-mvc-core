
// Using STRICT mode for ES6 features
"use strict";

// Requiring core assert
const assert = require('assert-plus');

/**
 * Requiring common Utils Library
 */
const BaseError = require('../lib/error/error');
const HTTPError = require('../lib/error/httperror');

// Redefine default application environment
if (process.env.APPLICATION_ENV == null) {
    process.env.APPLICATION_ENV = 'test';
}

describe('Core Errors', function () {

    // Describing core registry tests
    describe('Base Error', function () {

        // Initialization test
        it('Check Error Initialization', function (done) {

            let message = "Failed to create Error";
            let code = 1263;
            let systemError = new Error("Failed to create core error");

            /** @type {HTTPError} */
            let error = HTTPError.create(message, HTTPError.HTTP_ERROR_FORBIDDEN, systemError).setCode(code);

            assert.equals(error.name, 'Error.HTTP');
            assert.equals(error.message, message);
            assert.equals(error.code, code);
            assert.equals(error.httpStatus, HTTPError.HTTP_ERROR_FORBIDDEN);

            done();
        });

    })
});
