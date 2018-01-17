
"use strict";

var config = require('../../lib/utilities/config');

/**
 * Node.js modules
 */
var expect = require('chai').expect;

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
        expect(config.instance.testsProperties).to.not.be.true;

        class CustomConfiguration extends config.Configuration {
            constructor () {
                super();
                this.testsProperties = true;
            }
        }
        config.replace(CustomConfiguration);

        expect(config.instance.testsProperties).to.be.true;
    });

});
