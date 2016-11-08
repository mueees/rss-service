'use strict';


let KueQueue = require('./kue-queue').KueQueue;
let cleanUp = require('./kue-queue').cleanUp;

let queueCache = {};

function get(name) {
    if(!queueCache[name]){
        queueCache[name] = new KueQueue(name);
    }

    return queueCache[name];
}

module.exports = {
    get: get,
    cleanUp: cleanUp
};