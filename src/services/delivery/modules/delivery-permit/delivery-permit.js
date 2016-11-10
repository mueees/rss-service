'use strict';

class DeliveryPermit {
    constructor(queue, updateFeedQueueName, queueNames, options) {
        this._queue = queue;

        this._updateFeedQueueName = updateFeedQueueName;
        this._queueNames = queueNames;

        this.maxUpdateFeedCount = options.maxUpdateFeedCount || 1;
        this.maxTotalJobCount = options.maxTotalJobCount || 50;
    }

    _getUpdateFeedJobCount() {
        let me = this;

        return this._queue.count([
            this._updateFeedQueueName
        ]).then(function (jobCount) {
            return jobCount;
        }).catch(function (error) {
            return Promise.reject({
                message: 'Cannot get jobs count from ' + me._updateFeedQueueName + ' due to: ' + error.message
            });
        });
    }

    _getTotalJobCount() {
        return this._queue.count(this._queueNames).then(function (jobCount) {
            return jobCount;
        }).catch(function (error) {
            return Promise.reject({
                message: 'Cannot get total jobs count due to: ' + error.message
            });
        });
    }

    canDeliveryFeed() {
        let me = this;

        return new Promise(function (resolve, reject) {
            me._getUpdateFeedJobCount().then(function (updateFeedJobCount) {
                // check update feed queue at first
                if (updateFeedJobCount >= me.maxUpdateFeedCount) {
                    reject({
                        message: 'Update feed queue contains too many jobs: ' + updateFeedJobCount
                    });

                    // check total count of jobs in all queues
                } else {
                    me._getTotalJobCount().then(function (totalJobCount) {
                        if (totalJobCount >= me.maxTotalJobCount) {
                            reject({
                                message: 'All queues contain too many jobs: ' + totalJobCount
                            });

                            // return permit to update feed
                        } else {
                            resolve();
                        }
                    }).catch(function (error) {
                        reject({
                            message: 'Delivery permit, total count: ' + error.message
                        });
                    });
                }
            }).catch(function (error) {
                reject({
                    message: 'Delivery permit, update count: ' + error.message
                });
            });
        });
    }
}

module.exports = DeliveryPermit;