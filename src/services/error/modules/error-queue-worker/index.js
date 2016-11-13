'use strict';

let ErrorQueueWorker = require('./error-queue-worker');
let errorProvider = require('../error-provider');
let errorCode = require('../../../../modules/error');

module.exports = new ErrorQueueWorker(errorProvider, errorCode);