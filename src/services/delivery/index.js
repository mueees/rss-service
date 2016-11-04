'use strict';

let queue = require('../../modules/queue');
let WorkerHive = require('../../modules/worker-hive').WorkerHive;
let DeliveryManager = require('./modules/delivery-manager').DeliveryManager;

let RandomDeliveryStrategy = require('./modules/delivery-strategies').RandomDeliveryStrategy;

let deliveryManager = null;

function initialize() {
    if (!deliveryManager) {
        let deliveryFeedQueue = queue.get();

        deliveryManager = new DeliveryManager({
            queue: deliveryFeedQueue,
            deliveryTimeout: 500
        });

        deliveryManager.registerStrategy('random', new RandomDeliveryStrategy());
        deliveryManager.setStrategyName('random');

        deliveryManager.initialize();
    }

    return deliveryManager;
}

module.exports = initialize;