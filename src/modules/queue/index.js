'use strict';


let KueQueue = require('./kue-queue').KueQueue;
let cleanUp = require('./kue-queue').cleanUp;

function get(name) {
    return new KueQueue(name);
}

module.exports = {
    get: get,
    cleanUp: cleanUp
};