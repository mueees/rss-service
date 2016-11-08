'use strict';

let expect = require('chai').expect;
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;
let log = require('mue-core/modules/log')(module);
let fs = require('fs');

let FeedXMLParser = require('./feed-xml-parser');

let feedMocks = {};

function checkFeed(feed) {
    expect(feed).to.be.ok;
    expect(feed.title).to.be.ok;
    expect(feed.posts).to.be.ok;

    let post = feed.posts[0];

    expect(post.title).to.be.ok;
    expect(post.body).to.be.ok;
    expect(post.description).to.be.ok;
    expect(post.link).to.be.ok;
    expect(post.publicDate).to.be.ok;
}

describe('Feed XML parser', function () {
    before(function (done) {
        let options = {
            encoding: 'utf8'
        };

        feedMocks['atom'] = fs.readFileSync(__dirname + '/feed-mocks/atom-reddit.txt', options);
        feedMocks['rss2'] = fs.readFileSync(__dirname + '/feed-mocks/rss-2-habrahabr.txt', options);

        done();
    });

    it('should parse atom', function (done) {
        let feedXMLParser = new FeedXMLParser();
        feedXMLParser.page = feedMocks.atom;

        feedXMLParser.parse().then(function () {
            asyncCheck(done, function () {
                checkFeed(feedXMLParser.feed);
            });
        }).catch(function (err) {
            done(new Error(err.message));
        });
    });

    it('should parse rss2', function (done) {
        let feedXMLParser = new FeedXMLParser();
        feedXMLParser.page = feedMocks.rss2;

        feedXMLParser.parse().then(function () {
            asyncCheck(done, function () {
                checkFeed(feedXMLParser.feed);
            });
        }).catch(function (err) {
            done(new Error(err));
        });
    });
});