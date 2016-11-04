'use strict';

let DELIVERY_MANAGER = require('./delivery-manager.constant');

class DeliveryManager {
    constructor(options) {
        this._queue = options.queue;

        // A Number, representing the ID value of the timer
        this._deliveryInterval = null;

        // map of strategies
        this._strategies = {};

        // current strategy name
        this._strategyName = null;

        this.deliveryTimeout = options.deliveryTimeout || DELIVERY_MANAGER.defaultDeliveryTimeout;
    }

    /**
     * Main method for running delivery manager
     * */
    initialize() {
        this._startDeliveryLoop();
    }

    /**
     * Add feed to update feedId queue
     * */
    addFeedToUpdate(feed) {

    }

    /**
     * Register strategy for picking feedId
     * */
    registerStrategy(name, strategy) {
        this._strategies[name] = strategy;
    }

    /**
     * Return current strategy name
     * */
    getStrategyName() {
        return this._strategyName;
    }

    /**
     * Set strategy name for picking feed
     * */
    setStrategyName(name) {
        if (this._strategies[name]) {
            this._strategyName = name;
        }
    }

    /**
     * Set timeout for execute delivery strategy
     * */
    setDeliveryTimeout() {

    }

    /**
     * Get timeout for execute delivery strategy
     * */
    getDeliveryTimeout() {

    }

    /**
     * Stop adding new feed for update
     * */
    stop() {

    }

    /*
     * Start adding new feed for update
     * */
    start() {

    }

    _stopDeliveryLoop() {
        if (this._deliveryInterval) {
            clearInterval(this._deliveryInterval);
        }
    }

    _startDeliveryLoop() {
        let me = this;

        this._deliveryInterval = setInterval(function () {
            me._processDelivery();
        }, this.deliveryTimeout);
    }

    /**
     * Executed every delivery timeout period
     * */
    _processDelivery() {
        let strategy = this._strategies[this._strategyName];

        strategy.execute().then(function (feed) {
            if (!feed) {
                console.log('Strategy error: feed invalid');
            } else {
                console.log(feed.title + ' is delivered to update');
            }
        }).catch(function (err) {
            console.log('Strategy error: ' + err.message);
        });
    }
}

exports.DeliveryManager = DeliveryManager;