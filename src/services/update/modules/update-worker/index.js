'use strict';

let log = require('mue-core/modules/log')(module);
let postManager = require('../../../../modules/post-manager');
let feedParserFactory = require('../../../../modules/feed-parser');
let ERRORS = require('../../../../modules/error').ERRORS;

let UpdateWorker = require('./update-worker');

let updateWorker = new UpdateWorker(feedParserFactory, postManager, log, ERRORS);

module.exports = updateWorker;