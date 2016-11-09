'use strict';

let _ = require('lodash');
let BaseDeliveryStrategy = require('./base-delivery-strategies');
let FeedManager = require('../../../../modules/feed-manager');
let log = require('mue-core/modules/log')(module);

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

class RandomDeliveryStrategy extends BaseDeliveryStrategy {
    execute() {
        return FeedManager.getFeeds().then(function (feeds) {
            if (_.isEmpty(feeds)) {
                return null;
            } else {
                let randomIndex = getRandom(0, feeds.length - 1);
                let feedModel = feeds[randomIndex];

                feedModel = _.pick(feedModel, ['title', '_id', 'link']);

                feedModel._id = feedModel._id.toString();

                return feedModel;
            }
        }).catch(function (error) {
            log.error(error.message);

            return Promise.reject({
                message: 'Cannot get feeds due to: ' + error.message
            });
        });
    }
}

module.exports = RandomDeliveryStrategy;