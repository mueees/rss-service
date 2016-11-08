'use strict';

let Page = require('./page');
let log = require('mue-core/modules/log')(module);
let requestPromise = require('mue-core/modules/request-promise');
let ERRORS = require('../error').ERRORS;

exports.get = function () {
    return new Page(log, requestPromise, ERRORS);
};