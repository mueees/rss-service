'use strict';

class FeedParser {
    constructor(pageLoader, feedParser) {
        this.pageLoader = pageLoader;
        this.feedParser = feedParser;

        this.feedUrl = null;
        this.page = null;
        this.feed = null;
    }

    parse() {
        let me = this;

        return new Promise(function (resolve, reject) {
            // load feed
            me._loadPage().then(function () {
                // parse feed
                me.feedParser.page = me.page;

                me.feedParser.parse().then(function () {
                    me.feed = me.feedParser.feed;
                    me.feed.url = me.feedUrl;

                    resolve(me.feed);
                }).catch(reject);
            }).catch(reject);
        });
    }

    _loadPage() {
        let me = this;

        return new Promise(function (resolve, reject) {
            if (me.page) {
                resolve(me.page);
            } else {
                me.pageLoader.url = me.feedUrl;

                me.pageLoader.load().then(function () {
                    me.page = me.pageLoader.page;

                    resolve(me.page);
                }, reject);
            }
        });
    }
}

module.exports = FeedParser;