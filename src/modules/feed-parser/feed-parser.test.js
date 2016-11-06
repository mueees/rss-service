'use strict';

let expect = require('chai').expect;
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;

let FeedParser = require('./index');

describe('Feed parser module', function () {
    describe('FeedParser', function () {
        let habrahabrFeedUrl = 'https://habrahabr.ru/rss/interesting';

        it('should be defined', function () {
            let feedParser = FeedParser.get();

            expect(feedParser).to.be.ok;
        });

        it('should parse habrahabr feed', function (done) {
            let feedParser = FeedParser.get();
            feedParser.feedUrl = habrahabrFeedUrl;

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
});