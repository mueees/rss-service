'use strict';

class FeedParser {
    constructor(pageLoader, feedParser, options) {
        options = options || {};

        this.pageLoader = pageLoader;
        this.feedParser = feedParser;

        this.feedUrl = options.feedUrl;
        this.page = options.page;
        this.feed = options.feed;
    }

    parse() {
        let me = this;

        return new Promise(function (resolve, reject) {
            // load feed
            me._loadPage().then(function () {
                me.feedParser.page = me.page;

                me.feedParser.parse().then(function () {
                    me.feed = me.feedParser.feed;
                    me.feed.link = me.feedUrl;

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