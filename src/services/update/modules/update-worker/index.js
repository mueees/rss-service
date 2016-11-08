'use strict';

let log = require('mue-core/modules/log')(module);
let postManager = require('../../../../modules/post-manager');
let feedParserFactory = require('../../../../modules/feed-parser');

let Worker = require('./update-worker');

let worker = new Worker(feedParserFactory, postManager, log);

module.exports = worker;