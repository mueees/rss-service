'use strict';

let queue = require('../../modules/queue');
let PrepareManager = require('./modules/prepare-manager');
let WorkerHive = require('../../modules/worker-hive').WorkerHive;
let prepareWorker = require('./modules/prepare-post-worker');
let config = require('../../config');
let log = require('mue-core/modules/log')(module);

// prepare manager instance
let prepareManager = null;

function initialize() {
    if (!prepareManager) {
        // initialize hive
        let hive = new WorkerHive({
            worker: prepareWorker,
            maxWorkers: 8
        });

        // initialize queues
        let preparePostQueue = queue.get(config.get('queues:preparePost'));
        let savePostQueue = queue.get(config.get('queues:savePost'));
        let errorQueue = queue.get(config.get('queues:error'));

        // initialize manager
        prepareManager = new PrepareManager({
            hive: hive,
            incomingQueue: preparePostQueue,
            outcomingQueue: savePostQueue,
            errorQueue: errorQueue,
            log: log
        });
    }

    return prepareManager;
}

module.exports = initialize;