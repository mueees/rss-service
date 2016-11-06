'use strict';

let BaseDeliveryStrategy = require('./base-delivery-strategies');
let FeedManager = require('../../../../modules/feed-manager');

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class RandomDeliveryStrategy extends BaseDeliveryStrategy {
    /**
     *
     * */
    execute() {
        return FeedManager.getFeeds().then(function (feeds) {
            let randomIndex = getRandom(0, feeds.length - 1);

            return feeds[randomIndex];
        }).catch(function (error) {
            return Promise.reject({
                message: 'Cannot get feeds'
            });
        });
    }
}

module.exports = RandomDeliveryStrategy;