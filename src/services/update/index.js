'use strict';

let queue = require('../../modules/queue');
let UpdateManager = require('./modules/update-manager').UpdateManager;
let WorkerHive = require('../../modules/worker-hive');
let UpdateWorker = require('./modules/update-worker');
let UPDATE_CONFIG = require('./config');

let updateManager = null;

module.exports = function () {
    if (!updateManager) {
        let hive = new WorkerHive({
            worker: UpdateWorker,
            maxWorkers: 5
        });

        let updateFeedQueue = queue.get();

        updateManager = new UpdateManager({
            hive: hive,
            queue: updateFeedQueue,
            taskName: UPDATE_CONFIG.updateFeedTaskName
        });
    }

    return updateManager;
};