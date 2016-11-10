'use strict';

let config = require('../../config');
let queue = require('../../modules/queue');
let DeliveryManager = require('./modules/delivery-manager');
let DeliveryPermit = require('./modules/delivery-permit');
let log = require('mue-core/modules/log')(module);

let RandomDeliveryStrategy = require('./modules/delivery-strategies').RandomDeliveryStrategy;

let deliveryManager = null;

function initialize() {
    if (!deliveryManager) {
        // initialize queue
        let updateFeedQueue = queue.get(config.get('queues:updateFeed'));

        // initialize delivery permit service
        let deliveryPermit = new DeliveryPermit(
            queue,
            config.get('queues:updateFeed'),
            [
                config.get('queues:updateFeed'),
                config.get('queues:preparePost'),
                config.get('queues:savePost')
            ],
            {
                maxUpdateFeedCount: 1,
                maxTotalJobCount: 50
            });

        // initialize manager
        deliveryManager = new DeliveryManager({
            outcomingQueue: updateFeedQueue,
            deliveryPermit: deliveryPermit,
            deliveryTimeout: 2000,
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