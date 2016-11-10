'use strict';

let feedUrls = [
    'https://habrahabr.ru/rss/interesting',
    'https://www.reddit.com/.rss',
    'https://geektimes.ru/rss/best'
];

let environment = require('mue-core/modules/environment');
let log = require('mue-core/modules/log')(module);
let _ = require('lodash');
let feedManager = require('../modules/feed-manager');

exports.init = function () {
    // initialize only in development or production modes
    if (!environment.isTest()) {
        let trackPromises = [];

        _.each(feedUrls, function (feedUrl) {
            trackPromises.push(feedManager.trackFeed(feedUrl));
        });

        return Promise.all(trackPromises).then(function () {
            log.info('Rss initialization done');
        }).catch(function () {
            // do nothing

            log.error('Cannot initialize rss service');
        });
    }else{
        log.info('Skip Rss initialization');
    }
};