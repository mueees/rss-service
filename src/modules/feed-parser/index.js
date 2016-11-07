'use strict';

/**
 * @module feed-parser
 * @description Fetch the data from a remote url and html source
 * */

let pageParser = require('../page-parser');
let FeedParserXML = require('./feed-xml-parser');
let FeedParser = require('./feed-parser');

exports.get = function (options) {
    options = options || {};

    let page = pageParser.get();
    let feedParserXml = new FeedParserXML();
    let feedParser = new FeedParser(page, feedParserXml);

    feedParser.feedUrl = options.feedUrl;

    return feedParser;
};