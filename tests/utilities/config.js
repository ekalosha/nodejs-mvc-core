
"use strict";

/**
 *
 */
var Configuration = require('../../lib/utilities/config');

/**
 *
 */
const fs = require('fs');
var expect = require('chai').expect;

/**
 * TESTS
 */
describe('utility CONFIG', function () {

    it('shuld exist', function () {
        expect(Configuration).to.be.a('function');
    });

    it('has static methods', function () {
        expect(Configuration.init,  "init").to.be.a('function');
        expect(Configuration.replace,  "replace").to.be.a('function');
        expect(Configuration.pathENV,  "pathENV").to.be.a('function');
        expect(Configuration.parseENV,  "parseENV").to.be.a('function');
    });

    it('Configuration static parseENV', function () {
        expect(Configuration.parseENV).to.be.a('function');
        // read
        var source = fs.readFileSync(__dirname+'/test.env', 'utf8', 'r');
        // parse
        var env = Configuration.parseENV(source);
        expect(env, 'parse env file "test.env"').to.eql({
            config_e: 'ENV',
            DB_USER: 'root',
            DB_PASS: 's1mpl3',
            DB_HOST: 'localhost',
        });
    });

    it('method "replace/init" => test', function () {
        class CustomConfiguration extends Configuration {
            constructor () {
                super();
                this.testsProperties = true;
            }
        }
        Configuration.replace(CustomConfiguration);
        expect(Configuration.instance.testsProperties, 'custom YES').to.be.true;
    });
    // it('Configuration read environment => test', function () {
    //     var env = config.Configuration.environment(__dirname+'/test.env');
    //     expect(env).to.eql({
    //         config_e: 'ENV',
    //         DB_USER: 'root',
    //         DB_PASS: 's1mpl3',
    //         DB_HOST: 'localhost',
    //     });
    //
    // });

});
