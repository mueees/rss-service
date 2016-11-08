'use strict';

let PostResource = require('../resources').PostResource;
let log = require('mue-core/modules/log')(module);
let PostManager = require('./post-manager');

let postManager = new PostManager(PostResource, log);

module.exports = postManager;