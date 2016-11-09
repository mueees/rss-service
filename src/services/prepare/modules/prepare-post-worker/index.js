'use strict';

let PreparePostWorker = require('./prepare-post-worker');

let log = require('mue-core/modules/log')(module);
let pageParserFactory = require('../../../../modules/page-parser');
let ERRORS = require('../../../../modules/error').ERRORS;

let preparePostWorker = new PreparePostWorker(pageParserFactory, log, ERRORS);

module.exports = preparePostWorker;