'use strict';

let queue = require('../../modules/queue');
let WorkManager = require('./../../modules/work-manager');
let WorkerHive = require('../../modules/worker-hive').WorkerHive;
let updateWorker = require('./modules/update-worker');
let config = require('../../config');
let log = require('mue-core/modules/log')(module);

// update manager instance
let updateManager = null;

function initialize() {
    if (!updateManager) {
        // initialize hive
        let hive = new WorkerHive({
            worker: updateWorker,
            maxWorkers: 1
        });

        // initialize queues
        let updateFeedQueue = queue.get(config.get('queues:updateFeed'));
        let preparePostQueue = queue.get(config.get('queues:preparePost'));
        let errorQueue = queue.get(config.get('queues:error'));

        // initialize manager
        updateManager = new WorkManager({
            hive: hive,
            incomingQueue: updateFeedQueue,
            outcomingQueue: preparePostQueue,
            errorQueue: errorQueue,
            log: log
        });
    }

    return updateManager;
}

module.exports = initialize;