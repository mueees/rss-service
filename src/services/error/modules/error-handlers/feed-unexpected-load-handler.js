'use strict';

class FeedUnexpectedLoadHandler {
    constructor(pageLoader, feedManager) {
        this._pageLoader = pageLoader;
        this._feedManager = feedManager;

        this._pageLoader.timeout = 10000;
    }

    fix(errorData) {
        let me = this;

        return new Promise(function (resolve, reject) {
            me._feedManager.getFeed(errorData.feedId).then(function (feed) {
                me._pageLoader.url = feed.link;

                me._pageLoader.load().then(function () {
                    resolve();
                }).catch(function () {
                    reject({
                        message: 'Cannot load feed with id: ' + errorData.feedId
                    })
                });
            }).catch(function () {
                reject({
                    message: 'Cannot get feed by id: ' + errorData.feedId
                });
            });
        });
    }
}

module.exports = FeedUnexpectedLoadHandler;