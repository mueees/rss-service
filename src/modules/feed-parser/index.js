'use strict';

/**
 * @module feed-parser
 * @description Fetch the data from a remote url and html source
 * */

let Page = require('../page-parser');
let FeedParserXML = require('./feed-xml-parser');
let FeedParser = require('./feed-parser');

exports.get = function () {
    let page = Page.get();
    let feedParserXml = new FeedParserXML();

    return new FeedParser(page, feedParserXml);
};