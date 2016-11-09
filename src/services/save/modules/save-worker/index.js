'use strict';

let SaveWorker = require('./save-worker');
let postManager = require('../../../../modules/post-manager');

module.exports = new SaveWorker(postManager);