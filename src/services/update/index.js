'use strict';

let queue = require('../../modules/queue');
let UpdateManager = require('./modules/update-manager');
let WorkerHive = require('../../modules/worker-hive').WorkerHive;
let updateWorker = require('./modules/update-worker');
let UPDATE_CONFIG = require('./config');

// update manager instance
let updateManager = null;

function initialize() {
    if (!updateManager) {
        let hive = new WorkerHive({
            worker: updateWorker,
            maxWorkers: 5
        });

        let updateFeedQueue = queue.get();

        updateManager = new UpdateManager({
            hive: hive,
            deliveryService: updateFeedQueue,
            taskName: UPDATE_CONFIG.updateFeedTaskName
        });
    }

    return updateManager;
}

module.exports = initialize;