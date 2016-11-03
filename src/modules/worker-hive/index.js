'use strict';

class WorkerHive {
    constructor(options) {
        if (!options.worker) {
            this.throwError('Worker cannot be empty');
        }

        let testWorker = new options.worker();

        if (!testWorker.execute) {
            this.throwError('Worker must has execute method');
        }

        this._maxWorkers = options.maxWorkers || 1;

        this._worker = options.worker;

        this._workerCount = 0;
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
            this.throwError('Max workers must be positive integer');
        } else {
            this._maxWorkers = count;
        }
    }

    finish() {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    }

    throwError(message) {
        throw new Error({
            isHive: true,
            message: message
        });
    }

    _getWorker() {
        return new this._worker();
    }
}

module.exports = WorkerHive;