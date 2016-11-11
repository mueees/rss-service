'use strict';

let ErrorQueueWorker = require('./error-queue-worker');
let errorProvider = require('../error-provider');

module.exports = new ErrorQueueWorker(errorProvider);