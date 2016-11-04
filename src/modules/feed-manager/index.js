'use strict';

let FeedResource = require('../resources').FeedResource;

/**
 * Return all feeds
 * */
function getFeeds() {
    // TODO: implement method

    return Promise.resolve([
        {
            _id: 1,
            title: 'Habrahabr',
            url: 'https://habrahabr.ru/rss/interesting'
        }
    ]);
}

module.exports = {
    getFeeds: getFeeds
};