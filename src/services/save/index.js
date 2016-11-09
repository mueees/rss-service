'use strict';

let SaveManager = require('./modules/save-manager');
let saveWorker = require('./modules/save-worker');
let queue = require('../../modules/queue');
let config = require('../../config');
let log = require('mue-core/modules/log')(module);
let WorkerHive = require('../../modules/worker-hive').WorkerHive;

let saveManager = null;

function initialize() {
    if (!saveManager) {
        let hive = new WorkerHive({
            worker: saveWorker,
            maxWorkers: 1
        });

        let savePostQueue = queue.get(config.get('queues:savePost'));

        saveManager = new SaveManager(savePostQueue, hive, log);
    }

    return saveManager;
}

module.exports = initialize;