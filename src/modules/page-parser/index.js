'use strict';

let pageFactory = require('../page');
let PageParser = require('./page-parser');

function get(options) {
    let pageLoader = pageFactory.get();

    return new PageParser(pageLoader, options);
}

exports.get = get;