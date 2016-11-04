'use strict';

let BaseDeliveryStrategy = require('./base-delivery-strategies');
let FeedManager = require('../../../../modules/feed-manager');

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

class RandomDeliveryStrategy extends BaseDeliveryStrategy {
    execute() {
        return FeedManager.getFeeds().then(function (feeds) {
            let randomIndex = getRandom(0, feeds.length);

            return feeds[randomIndex];
        });
    }
}

module.exports = RandomDeliveryStrategy;