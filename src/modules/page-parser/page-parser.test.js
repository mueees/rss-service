'use strict';

let expect = require('chai').expect;
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;
let Page = require('./index');

describe('Page parser', function () {


    describe('Page class', function () {
        let pageUrl = 'http://google.com';

        it('should be implemented', function () {
            let page = Page.get();

            expect(page).to.be.ok;
        });

        it('should load the html', function (done) {
            let page = Page.get();
            page.url = pageUrl;

            page.load().then(function () {
                asyncCheck(done, function () {
                    expect(page.page).to.be.ok;
                });
            }).catch(function () {
                done(new Error('Cannot get page'));
            })
        });

        it('should parse html', function (done) {
            let page = Page.get();
            page.url = pageUrl;

            page.parse().then(function () {
                asyncCheck(done, function () {
                    expect(page.page).to.be.ok;
                    expect(page.pageDetails).to.be.ok;
                });
            }).catch(function () {
                done(new Error('Cannot get page'));
            })
        });
    });
});