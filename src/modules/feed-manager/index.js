'use strict';

let FeedResource = require('../resources').FeedResource;
let feedParserFactory = require('../feed-parser');
let log = require('mue-core/modules/log')(module);
let FeedManager = require('./feed-manager');

let feedManager = new FeedManager(feedParserFactory, FeedResource, log);

module.exports = feedManager;