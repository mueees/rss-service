'use strict';

let FeedResource = require('../resources').FeedResource;
let FeedParser = require('../feed-parser');
let log = require('mue-core/modules/log')(module);

/**
 * Return all feeds
 * */
function getFeeds() {
    return FeedResource.find({});
}

function trackFeed(feedUrl) {
    return canTrackFeed(feedUrl).then(function (feed) {
        return FeedResource.create(feed).then(function (feedResource) {
            return {
                _id: feedResource._id
            }
        }).catch(function (error) {
            log.error(error);

            return Promise.reject({
                message: 'Cannot create feed'
            });
        });
    });
}

function canTrackFeed(feedUrl) {
    if (feedUrl) {
        return new Promise(function (resolve, reject) {
            let feedParser = new FeedParser.get();
            feedParser.feedUrl = feedUrl;

            let feed = FeedResource.findOne({
                url: feedUrl
            });

            Promise.all([
                feed,
                feedParser.parse()
            ]).then(function (data) {
                let feed = data[0];
                let parsedFeed = data[1];

                if (feed) {
                    reject({
                        message: 'Feed already exist'
                    });
                } else {
                    if (!parsedFeed) {
                        reject({
                            message: 'Cannot parse feed'
                        });
                    } else {
                        resolve(parsedFeed);
                    }
                }
            }).catch(function (error) {
                reject({
                    message: 'Cannot track due to: ' + error.message
                })
            });
        });
    } else {
        return Promise.reject({
            message: 'Invalid feed url'
        });
    }
}

module.exports = {
    getFeeds: getFeeds,

    trackFeed: trackFeed,

    canTrackFeed: canTrackFeed
};