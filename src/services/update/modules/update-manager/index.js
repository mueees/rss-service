'use strict';

/*
 *
 * Data that should be available from admin panel
 * - count of workers
 * - average time for processing
 *
 * Methods:
 * - change workers number
 * */

class UpdateManager {
    constructor(options) {
        let me = this;

        this._hive = options.hive;
        this._queue = options.queue;

        this._queue.process(options.taskName, function (job, done) {
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
                me._failedJobhandler(err, job, done);
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

    _failedJobhandler(err, job) {
        console.log('Cannot update feed due to: ' + err.message);
    }
}

exports.UpdateManager = UpdateManager;