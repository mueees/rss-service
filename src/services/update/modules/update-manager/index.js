'use strict';

/*
 *
 * Data that should be available from admin panel
 * - count of workers
 * - average time for processing
 *
 * Methods:
 * - change workers number
 * - pause work
 * - resume work
 *
 * */

class UpdateManager {
    constructor(options) {
        this._hive = options.hive;
        this._queue = options.queue;

        this._initializeQueue(options.taskName);
    }

    setMaxWorkers(count) {
        this._hive.setMaxWorkers(count);
    }

    _processJob(job, done) {
        let me = this;

        if (this._hive.hasFreeWorker()) {
            done(null);

            let me = this;

            this._hive.execute(job.data).then(function (result) {
                me._successJobProcess(result, job, done);
            }).catch(function (err) {
                me._failedJobProcess(err, job, done);
            });
        } else {
            let me = this;

            setTimeout(function () {
                me._processJob(job, done);
            }, 1000);
        }
    }

    _successJobProcess(result, job, done) {

    }

    _failedJobProcess(err, job, done) {
        if (err.isHive) {
            console.log('Hive error: ' + err.message);
        } else {

        }
    }

    _initializeQueue(taskName) {
        var me = this;

        this._queue.on('error', function (err) {
            console.log('Queue got the error: ' + err);
        });

        this._queue.process(taskName, 5, function (job, done) {
            me._processJob(job, done);
        });
    }
}

exports.UpdateManager = UpdateManager;