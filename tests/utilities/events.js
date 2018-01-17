
"use strict";

/**
 *
 */
var eventBus = require('../../lib/utilities/events');

/**
 *
 */
var expect = require('chai').expect;

/**
 * TESTS
 */
describe('utility EVENTS', function () {

    it('shuld exist', function () {
        expect(eventBus).to.be.a('object');
    });

    it('has class "EventBus"', function () {
        expect(eventBus.EventBus).to.be.a('function');
    });

    it('has "instance"', function () {
        expect(eventBus.instance).to.be.a('object');
    });

    it('"instance" instanceof "EventBus"', function () {
        expect(eventBus.instance instanceof eventBus.EventBus).to.be.true;
    });

    it('has method "replace"', function () {
        expect(eventBus.replace).to.be.a('function');
    });

    it('method "replace" => test', function () {
        expect(eventBus.instance.testsProperties).to.not.be.true;

        class CustomEventBus extends eventBus.EventBus {
            constructor () {
                super();
                this.testsProperties = true;
            }
        }
        eventBus.replace(CustomEventBus);

        expect(eventBus.instance.testsProperties).to.be.true;
    });

});
