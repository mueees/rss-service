'use strict';

let FeedResource = require('../resources/feed.resource');

function clear() {
    return Promise.all([
        FeedResource.remove()
    ]);
}

exports.db = {
    clear: clear
};