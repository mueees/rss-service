'use strict';

let resources = require('../resources');
let FeedResource = resources.FeedResource;
let PostResource = resources.PostResource;

function clear() {
    return Promise.all([
        FeedResource.remove(),
        PostResource.remove()
    ]);
}

exports.db = {
    clear: clear
};