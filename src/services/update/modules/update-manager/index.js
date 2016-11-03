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

let UPDATE_MANAGER = require('./update-manager.constant');

class UpdateManager {
    constructor(options) {
        this._maxWorkers = options.maxWorkers || UPDATE_MANAGER.defaultWorkerCount;
        this._Worker = options.Worker;
        this._Hive = options.Hive;
        this._queue = options.queue;
        this.queueName = options.queueName;

        this._hive = new this._Hive({
            worker: this._Worker,
            maxWorkers: this._maxWorkers
        });

        this._initializeQueue();
    }

    setMaxWorkers(count) {
        try {
            this._hive.setMaxWorkers(count);
        } catch (e) {
            console.log('Cannot set max workers');
        }
    }

    _processJob(job, done) {
        if (this._hive.hasFreeWorker()) {
            done();

            this._hive.execute(job.data).then(function (result) {
                console.log('Work ' + result + ' done');
            }).catch(function () {
                console.log('Catch the error from the worker');
            });
        } else {
            console.log('No free workers');

            let me = this;
            setTimeout(function () {
                me._processJob(job, done);
            }, 1000);
        }
    }

    _initializeQueue() {
        var me = this;

        this.queue = this._queue.get(this.queueName);

        this.queue.on('ready', function (err) {
            console.log('Queue establish connection');
        });

        this.queue.on('error', function (err) {
            console.log('Queue got the error: ' + err);
        });

        this.queue.process(function (job, done) {
            me._processJob(job, done)
        });
    }
}

exports.UpdateManager = UpdateManager;