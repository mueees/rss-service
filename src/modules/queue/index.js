'use strict';

var Queue = require('bull');

function getQueue(name) {
    return createQueue(name);
}

function createQueue(name) {
    return Queue(name, 6379, '127.0.0.1');
}

exports.get = getQueue;