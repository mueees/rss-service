'use strict';

/**
 * The main class for managing feed updating.
 * Goal:
 * - take the object which supply new jobs - updateFeedQueue
 * - take the object where to pass new job - preparePostQueue
 * - pass the work to the hive with workers
 * - set/get count of workers
 *
 * Improvement:
 * - depending on the custom options change number of worker
 * - depending on the custom options change type of worker
 * - change type of worker
 * - change different strategies for success and error handlers
 * */

let _ = require('lodash');

class UpdateManager {
    constructor(options) {
        let me = this;

        this._log = options.log;

        this._hive = options.hive;

        // take feed for update
        this._updateFeedQueue = options.updateFeedQueue;

        // put posts to prepare
        this._preparePostQueue = options.preparePostQueue;

        // send error report
        this._errorQueue = options.errorQueue;

        this._updateFeedQueue.process(function (job, done) {
            me._processJob(job, done);
        });
    }

    setMaxWorkers(count) {
        this._hive.setMaxWorkers(count);
    }

    getMaxWorkers() {
        this._hive.getMaxWorkers();
    }

    /**
     * Main method that process job
     * */
    _processJob(job, done) {
        let me = this;

        if (this._hive.hasFreeWorker()) {
            done(null);

            // worker has to return new posts from the current feed
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

    _successJobHandler(posts, job) {
        this._log.info(job.data.title + ' was successfully updated');

        this._addPostForPrepare(posts);
    }

    _failedJobHandler(err, job) {
        this._log.error('Cannot update feed due to: ' + err.message);

        this._sendErrorReport(err);
    }

    _addPostForPrepare(posts) {
        let me = this;

        if (!_.isArray(posts)) {
            posts = [posts];
        }

        _.each(posts, function (post) {
            me._preparePostQueue.add(post);
        });


    }

    _sendErrorReport(error) {
        this._errorQueue.add(error);
    }
}

module.exports = UpdateManager;