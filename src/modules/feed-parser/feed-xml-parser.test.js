'use strict';

let expect = require('chai').expect;
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;
let log = require('mue-core/modules/log')(module);
let fs = require('fs');

let ERRORS = require('./../error').ERRORS;
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

function getFeedXmlParser(options) {
    return new FeedXMLParser(log, ERRORS, options);
}

describe('Feed XML parser', function () {
    before(function () {
        let options = {
            encoding: 'utf8'
        };

        feedMocks['atom'] = fs.readFileSync(__dirname + '/feed-mocks/atom-reddit.txt', options);
        feedMocks['rss2'] = fs.readFileSync(__dirname + '/feed-mocks/rss-2-habrahabr.txt', options);
        feedMocks['wrong'] = 'WRONG';
    });

    it('should parse atom', function (done) {
        let feedXMLParser = getFeedXmlParser({
            page: feedMocks.atom
        });

        feedXMLParser.parse().then(function () {
            asyncCheck(done, function () {
                checkFeed(feedXMLParser.feed);

                expect(feedXMLParser.feed.posts.length).to.equal(25);
            });
        }).catch(function (err) {
            done(new Error(err.message));
        });
    });

    it('should parse rss2', function (done) {
        let feedXMLParser = getFeedXmlParser({
            page: feedMocks.rss2
        });

        feedXMLParser.parse().then(function () {
            asyncCheck(done, function () {
                checkFeed(feedXMLParser.feed);

                expect(feedXMLParser.feed.posts.length).to.equal(20);
            });
        }).catch(function (err) {
            done(new Error(err));
        });
    });

    it('should return reject with the parseError code', function (done) {
        let feedXMLParser = getFeedXmlParser();

        feedXMLParser.page = feedMocks['wrong'];

        feedXMLParser.parse().then(function () {
            done(new Error('Unknown error'));
        }).catch(function (err) {
            asyncCheck(done, function () {
                expect(err.code).to.equal(ERRORS.feedParser.parseError.code);
            });
        });
    });
});