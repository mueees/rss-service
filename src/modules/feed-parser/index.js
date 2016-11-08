'use strict';

/**
 * @module feed-parser
 * @description Fetch the data from a remote url and html source
 * */

let pageFactory = require('../page');
let FeedParserXML = require('./feed-xml-parser');
let FeedParser = require('./feed-parser');
let log = require('mue-core/modules/log')(module);
let ERRORS = require('../error').ERRORS;

exports.get = function (options) {
    options = options || {};

    // pageLoader for loading web pages
    let pageLoader = pageFactory.get();

    // instance for parsing feed pages
    let feedParserXml = new FeedParserXML(log, ERRORS);

    return new FeedParser(pageLoader, feedParserXml, options);
};