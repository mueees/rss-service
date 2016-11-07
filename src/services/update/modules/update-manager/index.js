'use strict';

/**
 * The main class for managing feed updating
 * Goal:
 * - take the object which supply new jobs - deliveryService
 * - pass the work to the hive with workers
 * - set/get count of workers
 *
 * Improvement:
 * - depending on the custom options change number of worker
 * - depending on the custom options change type of worker
 *
 * */

class UpdateManager {
    constructor(options) {
        let me = this;

        this._hive = options.hive;

        this._deliveryService = options.deliveryService;

        this._deliveryService.process(options.taskName, function (job, done) {
            me._processJob(job, done);
        });
    }

    setMaxWorkers(count) {
        this._hive.setMaxWorkers(count);
    }

    getMaxWorkers() {
        this._hive.getMaxWorkers();
    }

    _processJob(job, done) {
        let me = this;

        if (this._hive.hasFreeWorker()) {
            done(null);

            this._hive.execute(job.data).then(function (result) {
                me._successJobHandler(result, job, done);
            }).catch(function (err) {
                me._failedJobHandler(err, job, done);
            });
        } else {
            setTimeout(function () {
                me._processJob(job, done);
            }, 1000);
        }
    }

    _successJobHandler(result, job) {
        console.log('Update feed successfully');
    }

    _failedJobHandler(err, job) {
        console.log('Cannot update feed due to: ' + err.message);
    }
}

module.exports = UpdateManager;