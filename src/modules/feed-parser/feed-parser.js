'use strict';

let Page = require('../page-parser').Page;
let FeedParserXML = require('./feed-xml-parser');

class FeedParser {
    constructor(options) {
        this.feedUrl = options.feedUrl;
        this.page = null;
        this.feed = null;
    }

    parse() {
        let me = this;

        return new Promise(function (resolve, reject) {
            // load feed
            me._loadPage().then(function () {
                // parse feed
                let feedParserXML = new FeedParserXML(me.page);

                feedParserXML.parse().then(function () {
                    me.feed = feedParserXML.feed;
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
                let page = new Page(me.feedUrl);

                page.load().then(function () {
                    me.page = page.page;

                    resolve(me.page);
                }, reject);
            }
        });
    }
}

module.exports = FeedParser;