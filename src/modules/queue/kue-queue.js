'use strict';

/**
 * Job counts: activeCount, completeCount, failedCount, delayedCount, inactiveCount
 *
 * */

let _ = require('lodash');
let log = require('mue-core/modules/log')(module);
let BaseQueue = require('./base-queue');
let kue = require('kue');

/**
 * Base queue which will be injected to all queue instances
 * */
let queueInstance = kue.createQueue();

class KueQueue extends BaseQueue {
    constructor(name) {
        super();

        this._queueName = name;
        this._queue = queueInstance;

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
        return this._queue.create(this._queueName, jobData).save(function (err) {
            if (err) {
                log.error(err.message);
            }
        });
    }

    // inactiveCount, activeCount, completeCount, failedCount, delayedCount
    countJobs() {
        let me = this;

        return Promise(function (resolve, reject) {
            me._getInactiveCount().then(function (inactiveCount) {
                resolve(inactiveCount);
            }).catch(reject)
        });

    }

    _getInactiveCount() {
        let me = this;

        return Promise(function (resolve, reject) {
            me._queue.inactiveCount(me._queueName, function (err, inactiveCount) {
                if (err) {
                    reject({
                        message: 'Cannot get inactive count of jobs'
                    });
                } else {
                    resolve(inactiveCount);
                }
            });
        });
    }
}

function initialize() {
    // remove active jobs
    return getActiveJobIds().then(function (activeJobIds) {
        log.info(activeJobIds.length + ' active jobs removed');

        _.each(activeJobIds, function (activeJobId) {
            kue.Job.get(activeJobId, function (err, job) {
                job.remove();
            });
        })
    }).catch(function (error) {
        return Promise.reject(error);
    })
}

function cleanUp() {
    log.info('Queue clean up process');

    kue.Job.rangeByState('complete', 0, 10000, 'asc', function (err, completedJobs) {
        log.info(completedJobs.length + ' completed jobs will be removed.');

        completedJobs.forEach(function (job) {
            job.remove();
        });
    });

    kue.Job.rangeByState('failed', 0, 10000, 'asc', function (err, failedJobs) {
        log.info(failedJobs.length + ' failed jobs will be removed.');

        failedJobs.forEach(function (job) {
            job.remove(function () {
                log.info('Failed ' + job.id + ' job was removed');
            });
        });
    });
}

/**
 * @param {Array} queues
 * @return {Promise} Promise resolve with job count
 * */
function count(queueNames) {
    return Promise.all([
        getInactiveCount(queueNames),
        getActiveCount(queueNames)
    ]).then(function (counts) {
        let total = 0;

        _.each(counts, function (count) {
            total += count;
        });

        return total;
    }).catch(function (error) {
        return Promise.reject({
            message: 'Cannot get total count of jobs from the queues'
        });
    });
}

function getInactiveCount(queueNames) {
    let inactivePromises = _.map(queueNames, function (queueName) {
        return getInactiveCountFromQueue(queueName);
    });

    return Promise.all(inactivePromises).then(function (counts) {
        let total = 0;

        _.each(counts, function (count) {
            total += count;
        });

        return total;
    }).catch(function (error) {
        return Promise.reject(error);
    });
}

function getInactiveCountFromQueue(queueName) {
    return new Promise(function (resolve, reject) {
        queueInstance.inactiveCount(queueName, function (err, inactiveCount) {
            if (err) {
                log.error(err);

                reject({
                    message: 'Cannot get inactive count of jobs'
                });
            } else {
                resolve(inactiveCount);
            }
        });
    });
}

function getActiveCount(queueNames) {
    let activePromises = _.map(queueNames, function (queueName) {
        return getActiveCountFromQueue(queueName);
    });

    return Promise.all(activePromises).then(function (counts) {
        let total = 0;

        _.each(counts, function (count) {
            total += count;
        });

        return total;
    }).catch(function (error) {
        return Promise.reject(error);
    });
}

function getActiveCountFromQueue(queueName) {
    return new Promise(function (resolve, reject) {
        queueInstance.activeCount(queueName, function (err, activeCount) {
            if (err) {
                log.error(err);

                reject({
                    message: 'Cannot get activeCount count of jobs'
                });
            } else {
                resolve(activeCount);
            }
        });
    });
}

function getActiveJobIds() {
    return new Promise(function (resolve, reject) {
        queueInstance.active(function (err, activeJobIds) {
            if (err) {
                reject({
                    message: 'Cannot get active jobs: ' + error.message
                });
            } else {
                resolve(activeJobIds);
            }
        });
    });
}

exports.KueQueue = KueQueue;
exports.cleanUp = cleanUp;
exports.count = count;
exports.initialize = initialize;