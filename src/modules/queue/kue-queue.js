'use strict';

let BaseQueue = require('./base-queue');

let kue = require('kue');


class KueQueue extends BaseQueue {
    constructor(name) {
        super();

        this._queueName = name;
        this._queue = kue.createQueue();

        this._queue.on('error', function (error) {
            console.log('Queue get the error: ' + error);
        })
    }

    process(callback) {
        this._queue.process(this._queueName, callback);
    }

    on() {
        return this._queue.on.apply(this, arguments);
    }

    add(jobData) {
        return this._queue.create(this._queueName, jobData);
    }
}

function cleanUp() {
    kue.Job.rangeByState('complete', 0, 1000, 'asc', function (err, jobs) {
        jobs.forEach(function (job) {
            job.remove(function () {
                console.log('removed ', job.id);
            });
        });
    });

    kue.Job.rangeByState('failed', 0, 1000, 'asc', function (err, jobs) {
        jobs.forEach(function (job) {
            job.remove(function () {
                console.log('removed ', job.id);
            });
        });
    });
}

exports.KueQueue = KueQueue;
exports.cleanUp = cleanUp;