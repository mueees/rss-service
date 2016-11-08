'use strict';

let expect = require('chai').expect;
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;

let feedParserFactory = require('./index');
let habrahabrFeedUrl = 'https://habrahabr.ru/rss/interesting';

describe('FeedParser', function () {
    it('should be defined', function () {
        let feedParser = feedParserFactory.get();

        expect(feedParser).to.be.ok;
    });

    it('should parse habrahabr feed', function (done) {
        let feedParser = feedParserFactory.get({
            feedUrl: habrahabrFeedUrl
        });

        feedParser.parse().then(function () {
            asyncCheck(done, function () {
                expect(feedParser.feed).to.be.ok;
                expect(feedParser.feed.title).to.be.ok;
            });
        }).catch(function (err) {
            done(new Error(err.message));
        });
    });
});