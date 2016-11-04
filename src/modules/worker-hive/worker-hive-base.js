'use strict';

class WorkerHiveBase {
    constructor(options) {
        this._maxWorkers = options.maxWorkers || 1;
        this._workerCount = 0;
        this._worker = options.worker;
    }

    execute(data) {
        let me = this;

        if (me.hasFreeWorker()) {
            return new Promise(function (resolve, reject) {
                let worker = me._getWorker();

                // increase worker count
                me._workerCount += 1;

                let workerResult = worker.execute(data);

                if (workerResult.then) {
                    workerResult.then(function (result) {
                        me._workerCount -= 1;
                        worker = null;

                        resolve(result);
                    }).catch(function (err) {
                        me._workerCount -= 1;
                        worker = null;

                        reject(err);
                    });
                } else {
                    me._workerCount -= 1;

                    resolve(workerResult);
                }
            });
        } else {
            return Promise.reject({
                isHive: true,
                message: 'There are no free workers'
            });
        }
    }

    hasFreeWorker() {
        return this._workerCount < this._maxWorkers;
    }

    setMaxWorkers(count) {
        if (!Number.isInteger(count) || count < 1) {
            count = 1;
        }

        this._maxWorkers = count;
    }

    getMaxWorkers() {
        return this._maxWorkers;
    }

    _getWorker() {
        throw new Error('_getWorker method must be implemented');
    }
}

module.exports = WorkerHiveBase;