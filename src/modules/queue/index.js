'use strict';

let kueQueue = require('./kue-queue');

/**
 * Return certain Queue based on the name
 * */
function get(name) {
    return new kueQueue.KueQueue(name);
}

module.exports = {
    /**
     * Return certain Queue based on the name
     * */
    get: get,

    /**
     * Set of jobs for clean up storage from old jobs
     * */
    cleanUp: kueQueue.cleanUp,

    /**
     * Return job total count from certain queues
     * */
    count: kueQueue.count
};