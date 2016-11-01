'use strict';

/**
 * General wrapper for the worker management
 *
 * */

let UPDATE_MANAGER = require('./update-manager.constant');
let cluster = require('cluster');

class UpdateManager {
    constructor(options) {
        this.options = {};
        this.options.workers = options.workers || UPDATE_MANAGER.defaultWorkerCount;
    }

    initialize() {
        if (cluster.isMaster) {
            // Fork master
            let me = this;

            return new Promise(function (resolve, reject) {
                console.log('before starting');

                for (var i = 0; i < 3; i++) {
                    cluster.fork();
                }

                console.log('after starting');

                me._startProcessJobs();
            });
        } else {
            // For workers

            return new Promise(function () {
                console.log('For workers')
            });
        }

    }

    _startProcessJobs() {
        return new Promise(function (resolve, rejetc) {
            resolve();
        });
    }

    _newJobHandler(job) {

    }

    pause() {

    }

    resume() {

    }
}

exports.UpdateManager = UpdateManager;