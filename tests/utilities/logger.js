
"use strict";

/**
 *
 */
var Logger = require('../../lib/utilities/logger');

/**
 *
 */
var expect = require('chai').expect;

/**
 * TESTS
 */
describe('utility LOGGER', function () {

    it('class "Logger" should exist', function () {
        expect(Logger).to.be.a('function');
    });

    it('has "instance"', function () {
        expect(Logger.instance).to.be.a('object');
    });

    it('"instance" instanceof "Logger"', function () {
        expect(Logger.instance instanceof Logger).to.be.true;
    });

    it('has method "replace"', function () {
        expect(Logger.replace).to.be.a('function');
    });

    it('method "replace" => test', function () {
        expect(Logger.instance.testsProperties, 'defaults NOT').to.not.be.true;

        class CustomLogger extends Logger {
            constructor () {
                super();
                this.testsProperties = true;
            }
        }
        Logger.replace(CustomLogger);
        expect(Logger.instance.testsProperties, 'custom YES').to.be.true;
        expect(Logger.instance instanceof Logger, 'should stay instanceof "Logger"').to.be.true;
    });

    it('"instance" should has method "log"', function () {
        expect(Logger.instance.log).to.be.a('function');
    });

    it('"instance" should has method "info"', function () {
        expect(Logger.instance.info).to.be.a('function');
    });

    it('"instance" should has method "warn"', function () {
        expect(Logger.instance.warn).to.be.a('function');
    });

    it('"instance" should has method "error"', function () {
        expect(Logger.instance.error).to.be.a('function');
    });

    it('"instance" should has method "debug"', function () {
        expect(Logger.instance.debug).to.be.a('function');
    });

});
