'use strict';

let expect = require('chai').expect;
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;

describe('Page parser', function () {
    let Page = require('./index').Page;

    describe('Page class', function () {
        let pageUrl = 'http://google.com';

        it('should be implemented', function () {
            expect(Page).to.be.ok;
        });

        it('should load the html', function (done) {
            let page = new Page(pageUrl);

            page.load().then(function () {
                asyncCheck(done, function () {
                    expect(page.page).to.be.ok;
                });
            }).catch(function () {
                done(new Error('Cannot get page'));
            })
        });

        it('should parse html', function (done) {
            let page = new Page(pageUrl);

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