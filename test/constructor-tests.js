/*jslint node:true, regexp: true */
/*global describe:false, it:false, beforeEach:false */

/*
 * test/constructor-tests.js
 * https://github.com/101100/xbee-promise
 *
 * Tests for the xbee-promise library constructor.
 *
 * Copyright (c) 2014 Jason Heard
 * Licensed under the MIT license.
 */

"use strict";

var should = require("should");

var proxyquire = require("proxyquire");
var mockSerial = require("./mock-serialport.js");
var mockApi = require("./mock-xbee-api.js");

var xbeePromise = proxyquire("../lib/xbee-promise.js", {
    'serialport': mockSerial,
    'xbee-api': mockApi
});

describe('xbee-promise', function () {

    describe('constructor', function () {

        function callConstructor(params) {
            return function () {
                xbeePromise(params);
            };
        }

        it("fails with non-object options parameter", function () {

            var badOptions = [ undefined, null, "string", true, 42 ];

            badOptions.forEach(function (options) {
                callConstructor(options).should.throw(/property 'portName' is missing/);
            });

        });

        it("fails with missing 'portName' options parameter", function () {

            var badOptions = [ {}, { test: "fail!" } ];

            badOptions.forEach(function (options) {
                callConstructor(options).should.throw(/property 'portName' is missing/);
            });

        });

        it("fails with missing 'module' options parameter", function () {

            callConstructor({
                portName: "portName path",
                a: 'a'
            }).should.throw(/property 'module' is missing/);

        });

        it("fails with incorrect 'module' options parameter", function () {

            callConstructor({
                portName: "portName path",
                module: "JiffyCorp"
            }).should.throw(/must be one of '802\.15\.4,ZNet,ZigBee'/);

        });

        it("fails with incorrect 'apiMode' options parameter", function () {

            callConstructor({
                portName: "portName path",
                module: "ZigBee",
                apiMode: 3
            }).should.throw(/must be one of '1,2'/);

        });

        it("fails with invalid 'defaultTimeoutMs' options parameter", function () {

            callConstructor({
                portName: "portName path",
                module: "ZigBee",
                defaultTimeoutMs: "two minutes"
            }).should.throw(/not of type 'integer'/);

            callConstructor({
                portName: "portName path",
                module: "ZigBee",
                defaultTimeoutMs: -12
            }).should.throw(/not greater than or equal with '10'/);

        });

        it("fails with non-object 'portOptions' options parameter", function () {

            var badOptions = [
                    {
                        portName: "portName path",
                        module: "ZigBee",
                        portOptions: "string"
                    },
                    {
                        portName: "portName path",
                        module: "ZigBee",
                        portOptions: true
                    },
                    {
                        portName: "portName path",
                        module: "ZigBee",
                        portOptions: 81
                    }
                ];

            badOptions.forEach(function (options) {
                callConstructor(options).should.throw(/property 'portOptions'.*must be an object/);
            });

        });

        it("passes port name to portName", function () {

            var portName = "fake port name",
                xbee;

            xbee = xbeePromise({ portName: portName, module: "ZigBee" });
            xbee.should.be.type('object');
            mockSerial.opened.should.equal(true);
            mockSerial.path.should.equal(portName);

        });

        it("passes parser to portName", function () {

            var portName = "fake port name",
                xbee;

            xbee = xbeePromise({ portName: portName, module: "ZigBee" });
            xbee.should.be.type('object');
            mockSerial.opened.should.equal(true);
            mockSerial.options.should.be.type('object');
            mockSerial.options.should.have.property("parser", mockApi.fauxParser);

        });

        it("passes 'portOptions' + parser to portName", function () {

            var portName = "fake port name",
                portOptions = {
                    string: "never",
                    numeric: 42,
                    other: function () { return; }
                },
                xbee;

            xbee = xbeePromise({ portName: portName, module: "ZigBee", portOptions: portOptions });
            xbee.should.be.type('object');
            mockSerial.opened.should.equal(true);
            mockSerial.options.should.be.type('object');
            mockSerial.options.should.have.property("parser", mockApi.fauxParser);
            mockSerial.options.should.have.property("string", "never");
            mockSerial.options.should.have.property("numeric", 42);
            mockSerial.options.should.have.property("other", portOptions.other);

        });

    });

});
