'use strict';

let expect = require('chai').expect;
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;
let config = require('../../config');
let db = require('../db');
let testHelper = require('../test-helper');

let feedManager = require('./index');
let feedUrl = 'https://www.reddit.com/.rss';

describe('Feed manager', function () {
    before(function (done) {
        db.initConnection({
            port: config.get('db:port'),
            name: config.get('db:name'),
            host: config.get('db:host')
        }).then(function () {
            done();
        }, function () {
            done(new Error('Cannot establish connection'));
        });
    });

    beforeEach(function (done) {
        testHelper.db.clear().then(function () {
            done();
        }, function () {
            done(new Error('Cannot establish connection'));
        })
    });

    it('should track new feed', function (done) {
        feedManager.trackFeed(feedUrl).then(function (feed) {
            asyncCheck(done, function () {
                expect(feed._id).to.be.ok;
            });
        }).catch(function (error) {
            done(new Error(error.message));
        });
    });
});