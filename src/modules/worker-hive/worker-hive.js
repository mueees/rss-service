'use strict';

let WorkerHiveBase = require('./worker-hive-base');

class WorkerHive extends WorkerHiveBase {
    _getWorker() {
        return this._worker;
    }
}

module.exports = WorkerHive;