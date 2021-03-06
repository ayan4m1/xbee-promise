/*jslint node:true */

/*
 * examples/simple-transmit.js
 * https://github.com/101100/xbee-promise
 *
 * Simple example showing the use of remoteTransmit and the returned promise.
 *
 * Copyright (c) 2014 Jason Heard
 * Licensed under the MIT license.
 */

"use strict";

var xbeePromise = require('../lib/xbee-promise.js');

var xbee = xbeePromise({
    portName: '/dev/ttyUSB1',
    portOptions: {
        baudrate: 115200
    },
    module: "ZigBee",
    // turn on debugging to see what the library is doing
    debug: false
});

var destinationId = process.argv && process.argv[2];
var data = process.argv && process.argv[3];

if (!data || process.argv[4]) {
    console.error('Usage:');
    console.error(process.argv.slice(0, 2).join(' ') + ' <destination ID> <data>');
    process.exit(1);
}

xbee.remoteTransmit({
    destinationId: destinationId,
    data: data
}).then(function () {
    // 'true' is returned for a successful transmission, so no need to print it.
    console.log("Transmission successful");
}).catch(function (e) {
    console.log("Transmission failed:\n", e);
}).fin(function () {
    xbee.close();
});

