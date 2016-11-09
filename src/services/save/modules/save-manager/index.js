'use strict';

class SaveManager {
    constructor(incomingQueue, hive, log) {
        let me = this;

        this._hive = hive;
        this._log = log;

        incomingQueue.process(function (job, done) {
            me._processJob(job, done);
        });
    }

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

    _successJobHandler(result, job) {

    }

    _failedJobHandler(error, job) {
        this._log.error('Cannot save post due to: ' + error.message);
    }
}

module.exports = SaveManager;