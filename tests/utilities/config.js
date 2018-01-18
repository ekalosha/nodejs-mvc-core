
"use strict";

/**
 *
 */
var config = require('../../lib/utilities/config');

/**
 *
 */
var expect = require('chai').expect;

/**
 * TESTS
 */
describe('utility CONFIG', function () {

    it('shuld exist', function () {
        expect(config).to.be.a('object');
    });

    it('has class "Configuration"', function () {
        expect(config.Configuration).to.be.a('function');
    });

    it('has "instance"', function () {
        expect(config.instance).to.be.a('object');
    });

    it('"instance" instanceof "Configuration"', function () {
        expect(config.instance instanceof config.Configuration).to.be.true;
    });

    it('has method "replace"', function () {
        expect(config.replace).to.be.a('function');
    });

    it('method "replace" => test', function () {
        expect(config.instance.testsProperties, 'defaults NOT').to.not.be.true;
        class CustomConfiguration extends config.Configuration {
            constructor () {
                super();
                this.testsProperties = true;
            }
        }
        config.replace(CustomConfiguration);
        expect(config.instance.testsProperties, 'custom YES').to.be.true;
    });

    it('Configuration static environment', function () {
        expect(config.Configuration.environment).to.be.a('function');
    });

    it('Configuration read environment => test', function () {
        var env = config.Configuration.environment(__dirname+'/test.env');
        expect(env).to.eql({
            config_e: 'ENV',
            DB_USER: 'root',
            DB_PASS: 's1mpl3',
            DB_HOST: 'localhost',
        });

    });

});
