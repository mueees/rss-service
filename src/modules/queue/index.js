'use strict';

let kue = require('kue');

function getQueue(name) {
    return createQueue(name);
}

function createQueue() {
    // unlike what the name createQueue suggests, it currently returns a singleton Queue instance.
    // So you can configure and use only a single Queue object within your node.js process.
    let queue = kue.createQueue();

    queue.on('error', function (error) {
        console.log('Queue get the error: ' + error);
    });

    return queue;
}

function cleanUpJob() {
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

setInterval(cleanUpJob, 10000);

exports.get = getQueue;