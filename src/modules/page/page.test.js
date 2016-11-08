'use strict';

let expect = require('chai').expect;
let log = require('mue-core/modules/log')(module);
let requestPromise = require('mue-core/modules/request-promise');
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;
let ERRORS = require('../error/index').ERRORS;

let Page = require('./page');

let googleUrl = 'http://google.com';

function getPageInstance() {
    return new Page(log, requestPromise, ERRORS);
}

describe('Page', function () {
    it('should load google', function () {
        let page = getPageInstance();

        page.url = googleUrl;

        page.load().then(function () {
            asyncCheck(done, function () {
                expect(page.page).to.be.ok;
            });
        }).catch(function () {
            done(new Error('Cannot get page'));
        });
    });

    it('should reject request with wrong host - unexpectedResponse code', function (done) {
        let page = getPageInstance();

        page.url = '://google.com';

        page.load().then(function () {
            done(new Error('Must return error'));
        }).catch(function (error) {
            asyncCheck(done, function () {
                expect(error.code).to.equal(ERRORS.request.unexpectedResponse.code);
            });
        });
    });

    it('should reject request with wrong domain - unexpectedResponse code', function (done) {
        let page = getPageInstance();

        page.url = 'http://WRONG_WRONG_HOST.com';

        page.load().then(function () {
            done(new Error('Must return error'));
        }).catch(function (error) {
            asyncCheck(done, function () {
                expect(error.code).to.equal(ERRORS.request.unexpectedResponse.code);
            });
        });
    });

    it('should reject request with error statusCode - errorStatusCode code', function (done) {
        let page = getPageInstance();

        page.url = 'http://google.com/WRONG_WRONG_PAGE'
        page.load().then(function () {
            done(new Error('Must return error'));
        }).catch(function (error) {
            asyncCheck(done, function () {
                expect(error.code).to.equal(ERRORS.request.errorStatusCode.code);
                expect(error.data.statusCode).to.equal(404);
            });
        });
    });
});