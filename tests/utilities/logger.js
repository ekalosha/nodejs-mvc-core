
"use strict";

/**
 *
 */
var logger = require('../../lib/utilities/logger');

/**
 *
 */
var expect = require('chai').expect;

/**
 * TESTS
 */
describe('utility LOGGER', function () {

    it('shuld exist', function () {
        expect(logger).to.be.a('object');
    });

    it('has class "Logger"', function () {
        expect(logger.Logger).to.be.a('function');
    });

    it('has "instance"', function () {
        expect(logger.instance).to.be.a('object');
    });

    it('"instance" instanceof "Logger"', function () {
        expect(logger.instance instanceof logger.Logger).to.be.true;
    });

    it('has method "replace"', function () {
        expect(logger.replace).to.be.a('function');
    });

    it('method "replace" => test', function () {
        expect(logger.instance.testsProperties).to.not.be.true;

        class CustomLogger extends logger.Logger {
            constructor () {
                super();
                this.testsProperties = true;
            }
        }
        logger.replace(CustomLogger);

        expect(logger.instance.testsProperties).to.be.true;
    });

});
