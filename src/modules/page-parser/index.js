'use strict';

let log = require('mue-core/modules/log')(module);

let Page = require('./page');
let PageParser = require('./page-parser');
let requestPromise = require('mue-core/modules/request-promise');

function get(options) {
    options = options || {};

    let pageParser = new PageParser();
    let page = new Page(pageParser, log, requestPromise);

    page.url = options.url;

    return page;
}

exports.get = get;