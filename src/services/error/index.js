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
let errorQueueWorker = require('./modules/error-queue-worker');

// error handlers
let errorHandlers = require('./modules/error-handlers');

let errorCustomer = require('./modules/error-customer');

let errorManager;

function initialize() {
    if (!errorManager) {
        // initialize incoming error queue
        let errorQueue = queue.get(config.get('queues:error'));

        // TODO: move to constant
        let fixingTimeout = 5000; // 2 seconds

        errorManager = new ErrorManager(log, errorQueue, errorQueueWorker, errorCustomer, fixingTimeout);

        errorManager.registerErrorWorker(4, errorHandlers.feedUnexpectedLoadHandler);

        errorManager.startScheduleFixing();
    }

    return errorManager;
}

module.exports = initialize;