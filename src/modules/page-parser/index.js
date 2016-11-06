'use strict';

let Page = require('./page');
let PageParser = require('./page-parser');
let requestPromise = require('mue-core/modules/request-promise');

exports.get = function () {
    return new Page(new PageParser(), requestPromise);
};