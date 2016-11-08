'use strict';

let log = require('mue-core/modules/log')(module);
let postManager = require('../../../../modules/post-manager');
let feedParserFactory = require('../../../../modules/feed-parser');
let ERRORS = require('../../../../modules/error').ERRORS;

let Worker = require('./update-worker');

let worker = new Worker(feedParserFactory, postManager, log, ERRORS);

module.exports = worker;