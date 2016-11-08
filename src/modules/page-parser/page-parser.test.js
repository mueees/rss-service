'use strict';

let fs = require('fs');
let expect = require('chai').expect;
let Page = require('./index');
let PageParser = require('./page-parser');
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;

// store page mocks from the local folder
let pageMocks = {};

describe('Page parser', function () {
    // initialize page mocks
    before(function () {
        let options = {
            encoding: 'utf8'
        };

        pageMocks['medium-article'] = fs.readFileSync(__dirname + '/page-mocks/medium-article.txt', options);
    });

    it('should parse html', function (done) {
        let pageParser = new PageParser(null, {
            page: pageMocks['medium-article']
        });

        pageParser.parse().then(function () {
            asyncCheck(done, function () {
                expect(pageParser.pageDetails).to.be.ok;
            });
        }).catch(function (error) {
            done(new Error(error.message));
        });
    });
});