'use strict';

let _ = require('lodash');

class WorkManager {
    constructor(options) {
        let me = this;

        this._log = options.log;

        // hive with the workers
        this._hive = options.hive;

        this._outcomingQueue = options.outcomingQueue;

        // send error report
        this._errorQueue = options.errorQueue;

        options.incomingQueue.process(function (job, done) {
            me._processJob(job, done);
        });
    }

    setMaxWorkers(count) {
        this._hive.setMaxWorkers(count);
    }

    getMaxWorkers() {
        this._hive.getMaxWorkers();
    }

    // hook
    postSuccessHandler(items, job) {
    }

    // hook
    postFailedHandler(error, job) {
    }

    /**
     * Main method that process job
     * */
    _processJob(job, done) {
        let me = this;

        if (this._hive.hasFreeWorker()) {
            done(null);

            this._hive.execute(job.data).then(function (result) {
                me._successJobHandler(result, job);
            }).catch(function (err) {
                me._failedJobHandler(err, job, done);
            });
        } else {
            setTimeout(function () {
                me._processJob(job, done);
            }, 1000);
        }
    }

    _successJobHandler(items, job) {
        let me = this;

        if (!_.isArray(items)) {
            items = [items];
        }

        _.each(items, function (item) {
            me._outcomingQueue.add(item);
        });

        this.postSuccessHandler(items, job);
    }

    _failedJobHandler(error, job) {
        this._log.error('Cannot update feed due to: ' + error.message);

        this._errorQueue.add(error);

        this.postFailedHandler(error, job);
    }
}

module.exports = WorkManager;