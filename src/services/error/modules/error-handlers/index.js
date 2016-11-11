'use strict';

let FeedUnexpectedLoadHandler = require('./feed-unexpected-load-handler');
let pageLoader = require('../../../../modules/page').get();
let feedManager = require('../../../../modules/feed-manager');

exports.feedUnexpectedLoadHandler = new FeedUnexpectedLoadHandler(pageLoader, feedManager);