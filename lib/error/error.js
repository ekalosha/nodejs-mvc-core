
// Using STRICT mode for ES6 features
"use strict";

/**
 *  Base system error
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class BaseError extends Error {

    /**
     * Error constructor
     */
    constructor (message, code, error) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(message, error);

        this._name = 'Error.Base';

        // Set error code if defined
        if (code) {
            this._code = code;
        }
    }

    /**
     * Create Error Instance
     *
     * @param message
     * @param code
     * @param error
     */
    static create (message, code, error) {
        let result;

        const CurrentClass = this;

        result = new CurrentClass(message, code, error);

        return result;
    }

    /**
     * Set code and returns current error
     *
     * @param code
     * @returns {*}
     */
    setCode (code) {
        this._code = code;

        return this;
    }

    /**
     * Error Code getter
     *
     * @returns {*}
     */
    get code () {
        return this._code;
    }

    /**
     * Returns name of error type
     */
    get name () {
        return this._name;
    }

    /**
     * Rewrite basic error string representation
     *
     * @returns {string}
     * @override
     */
    toString () {
        var result = 'ERROR[' + this.name + '] ' + this.message;

        return result;
    }
}

/**
 * Exporting Module
 */
module.exports = BaseError;
