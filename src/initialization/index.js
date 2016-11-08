'use strict';

let feedUrls = [
    'https://habrahabr.ru/rss/interesting'
];

let _ = require('lodash');
let feedManager = require('../modules/feed-manager');

exports.init = function () {
    let trackPromises = [];

    _.each(feedUrls, function (feedUrl) {
        trackPromises.push(feedManager.trackFeed(feedUrl));
    });

    return Promise.all(trackPromises);
};