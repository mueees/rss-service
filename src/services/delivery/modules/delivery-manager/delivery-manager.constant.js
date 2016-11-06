'use strict';

let DELIVERY_MANAGER = {

    // timeout for execute delivery strategy
    defaultDeliveryTimeout: 1000,

    statuses: {
        stop: 'stop',
        running: 'running'
    }
};

module.exports = DELIVERY_MANAGER;