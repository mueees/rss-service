'use strict';

let FeedParser = require('feedparser');

class FeedParserXML {
    constructor(xml) {
        this.xml = xml;
    }

    parse() {
        let me = this;

        return new Promise(function (resolve, reject) {
            var feedparser = new FeedParser();

            feedparser.on('readable', function () {
                let meta = this.meta;

                me.feed = {
                    title: meta.title,
                    description: meta.description,
                    language: meta.language,
                    image: meta.image.url
                };

                resolve(me.feed);
            });

            feedparser.on('error', function (err) {
                reject({
                    message: 'Cannot parse feed due to: ' + err.message
                });
            });

            feedparser.end(me.xml);
        });
    }
}

module.exports = FeedParserXML;