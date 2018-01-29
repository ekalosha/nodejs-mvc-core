
// Using STRICT mode for ES6 features
"use strict";

// Require base Error implementation
const BaseError = require('./error.js');

/**
 *  HTTP error
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class HTTPError extends BaseError {

    /**
     * Error constructor
     *
     * @param message
     * @param httpStatus
     * @param code
     * @param error
     */
    constructor (message, httpStatus, error) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(message, httpStatus, error);

        this._name = 'Error.HTTP';

        // Set HTTP Error Status
        this._httpStatus = httpStatus;
    }

    /**
     * HTTP Status of Error request
     *
     * @returns {*|HTTPError.httpStatus}
     */
    get httpStatus () {
        return this._httpStatus;
    }

    /**
     * Set HTTP Status and return modified object
     *
     * @param httpStatus
     */
    httpStatus (httpStatus) {
        this._httpStatus = httpStatus;

        return this;
    }
}

/**
 * Base HTTP status codes
 *
 * @type {number}
 */
HTTPError.HTTP_ERROR_BAD_REQUEST = 400;
HTTPError.HTTP_ERROR_UNAUTHORIZED = 401;
HTTPError.HTTP_ERROR_PAYMENT_REQUIRED = 402;
HTTPError.HTTP_ERROR_FORBIDDEN = 403;
HTTPError.HTTP_ERROR_NOT_FOUND = 404;
HTTPError.HTTP_ERROR_METHOD_NOT_ALLOWED = 405;
HTTPError.HTTP_ERROR_NOT_ACCEPTABLE = 406;
HTTPError.HTTP_ERROR_REQUEST_TIMEOUT = 408;
HTTPError.HTTP_ERROR_CONFLICT = 409;
HTTPError.HTTP_ERROR_INTERNAL_ERROR = 500;
HTTPError.HTTP_ERROR_NOT_IMPLEMENTED = 501;
HTTPError.HTTP_ERROR_UNSUFFICIENT_STORAGE = 507;

/**
 * Exporting Module
 */
module.exports = HTTPError;
