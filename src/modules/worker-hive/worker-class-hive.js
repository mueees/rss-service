'use strict';

let WorkerHiveBase = require('./worker-hive-base');

class WorkerClassHive extends WorkerHiveBase {
    _getWorker() {
        return new this._worker();
    }
}

module.exports = WorkerClassHive;