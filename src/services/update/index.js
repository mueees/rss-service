'use strict';

let queue = require('../../modules/queue');
let UpdateManager = require('./modules/update-manager').UpdateManager;
let WorkerHive = require('../../modules/worker-hive');
let UpdateWorker = require('./modules/update-worker');

let updateManager = null;

module.exports = function () {
    if (!updateManager) {
        updateManager = new UpdateManager({
            Worker: UpdateWorker,
            Hive: WorkerHive,
            queue: queue,
            queueName: 'feed:update',
            maxWorkers: 5000
        });
    }

    return updateManager;
};