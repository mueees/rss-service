'use strict';

let config = require('../../config');
let queue = require('../../modules/queue');
let DeliveryManager = require('./modules/delivery-manager');
let log = require('mue-core/modules/log')(module);

let RandomDeliveryStrategy = require('./modules/delivery-strategies').RandomDeliveryStrategy;

let deliveryManager = null;

function initialize() {
    if (!deliveryManager) {
        // initialize queue
        let updateFeedQueue = queue.get(config.get('queues:updateFeed'));

        // initialize manager
        deliveryManager = new DeliveryManager({
            outcomingQueue: updateFeedQueue,
            deliveryTimeout: 10000,
            log: log
        });

        // set up strategy
        deliveryManager.registerStrategy('random', new RandomDeliveryStrategy());
        deliveryManager.setStrategyName('random');

        deliveryManager.start();
    }

    return deliveryManager;
}

module.exports = initialize;