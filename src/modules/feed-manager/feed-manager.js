'use strict';

class FeedManager {
    constructor(feedParserFactory, FeedResource, log) {
        this.feedParserFactory = feedParserFactory;
        this.FeedResource = FeedResource;
        this.log = log;
    }

    getFeeds() {
        return this.FeedResource.find({});
    }

    canTrackFeed(feedUrl) {
        let me = this;

        if (feedUrl) {
            return new Promise(function (resolve, reject) {
                let feedParser = me.feedParserFactory.get({
                    feedUrl: feedUrl
                });

                let feed = me.FeedResource.findOne({
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

    trackFeed(feedUrl) {
        let me = this;

        return this.canTrackFeed(feedUrl).then(function (feed) {
            return me.FeedResource.create(feed).then(function (feedResource) {
                return {
                    _id: feedResource._id
                }
            }).catch(function (error) {
                me.log.error(error);

                return Promise.reject({
                    message: 'Cannot create feed'
                });
            });
        });
    }
}

module.exports = FeedManager;