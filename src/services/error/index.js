'use strict';

/**
 * Error service
 *
 * Responsible for all rss errors. Request error, parse feed error ...
 * Collect them, trying to fix and provide API for retrieving the errors
 *
 * */

let config = require('../../config');
let queue = require('../../modules/queue');
let log = require('mue-core/modules/log')(module);

let ErrorManager = require('./modules/error-manager');
let ErrorQueueWorker = require('./modules/error-queue-worker');

let errorManager;

function initialize() {
    if (!errorManager) {
        // initialize incoming error queue
        let errorQueue = queue.get(config.get('queues:error'));

        // initialize worker which process errors from the queue
        let errorQueueWorker = new ErrorQueueWorker();

        // TODO: move to constant
        let fixingTimeout = 1000 * 60; // 1 minutes

        // TODO: implement
        let errorDeliver = {
            get: function () {
                return Promise.resolve();
            }
        };

        errorManager = new ErrorManager(log, errorQueue, errorQueueWorker, errorDeliver, fixingTimeout);
    }

    return errorManager;
}

module.exports = initialize;