'use strict';

let config = require('../../config');
let queue = require('../../modules/queue');
let DeliveryManager = require('./modules/delivery-manager').DeliveryManager;

let RandomDeliveryStrategy = require('./modules/delivery-strategies').RandomDeliveryStrategy;

let deliveryManager = null;

function initialize() {
    if (!deliveryManager) {
        // initialize queue
        let updateFeedQueue = queue.get(config.get('queues:updateFeed'));

        deliveryManager = new DeliveryManager({
            updateFeedQueue: updateFeedQueue,
            deliveryTimeout: 500
        });

        // set up strategy
        deliveryManager.registerStrategy('random', new RandomDeliveryStrategy());
        deliveryManager.setStrategyName('random');

        deliveryManager.start();
    }

    return deliveryManager;
}

module.exports = initialize;