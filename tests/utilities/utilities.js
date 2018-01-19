
"use strict";

/**
 *
 */
var Logger = require('../../lib/utilities/logger');
var Utilities = require('../../lib/utilities/utilities');
var CoreEvent = require('../../lib/utilities/coreevent');
var Configuration = require('../../lib/utilities/configuration');
/**
 *
 */
var expect = require('chai').expect;

/**
 * DEV Node.js modules "mocha" was running tests
 */
 describe('test UTILITIES:', function () {

     require('./logger.js');
     require('./coreevent.js');
     require('./configuration.js');

     var instance = new Utilities();

     it('class "Utilities" should exist', function () {
         expect(Utilities).to.be.a('function');
     });

     it('"instance" should has logger', function () {
         expect(instance.logger,  "should exist").to.be.a('object');
         expect(instance.logger instanceof Logger, 'instanceof "Logger"').to.be.true;
     });

     it('"instance" should has configuration', function () {
         expect(instance.config,  "should exist").to.be.a('object');
         expect(instance.config instanceof Configuration, 'instanceof "Configuration"').to.be.true;
     });

     it('"instance" should has coreEvent', function () {
         expect(instance.coreEvent,  "should exist").to.be.a('object');
         expect(instance.coreEvent instanceof CoreEvent, 'instanceof "CoreEvent"').to.be.true;
     });

 });