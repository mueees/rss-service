'use strict';

let DELIVERY_MANAGER = require('./delivery-manager.constant');

/**
 * The main class for managing feed delivering
 *
 * Support different strategy types:
 * - strategy that allow or disallow add feed to update
 * - strategy that choose which feed should be added to update
 *
 * */

class DeliveryManager {
    constructor(options) {
        this._updateFeedQueue = options.updateFeedQueue;

        this.log = options.log;

        // A Number, representing the ID value of the timer
        this._deliveryTimer = null;

        // map of strategies
        this._strategies = {};

        // current strategy name
        this._strategyName = null;

        this.deliveryTimeout = options.deliveryTimeout || DELIVERY_MANAGER.defaultDeliveryTimeout;

        this.status = DELIVERY_MANAGER.statuses.stop;
    }

    /**
     * Add feed to update
     * */
    addFeedToUpdate(feed) {
        let me = this;

        return new Promise(function (resolve, reject) {
            me._updateFeedQueue.add(feed);

            resolve();
        });
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
    setDeliveryTimeout(deliveryTimeout) {
        this.deliveryTimeout = deliveryTimeout;
    }

    /**
     * Stop adding new feed for update
     * */
    stop() {
        this.status = DELIVERY_MANAGER.statuses.stop;
        this._stopDeliveryLoop();
    }

    /*
     * Start adding new feed for update
     * */
    start() {
        this.status = DELIVERY_MANAGER.statuses.running;

        this._startDeliveryLoop();
    }

    _stopDeliveryLoop() {
        if (this._deliveryTimer) {
            clearTimeout(this._deliveryTimer);
        }
    }

    _startDeliveryLoop() {
        this._processDelivery();
    }

    /**
     * Executed every delivery timeout period
     * */
    _processDelivery() {
        let me = this;
        let strategy = this._strategies[this._strategyName];

        strategy.execute().then(function (feed) {
            if (!feed) {
                me.log.info('There is no feed for update');

                me._processPostDelivery();
            } else {
                me.addFeedToUpdate(feed).then(function () {
                    me.log.info(feed.title + ' was added to update');

                    me._processPostDelivery();
                }).catch(function (error) {
                    me.log.error('Cannot add feed to update due to: ' + error.message);

                    me._processPostDelivery();
                });
            }
        }).catch(function (err) {
            me.log.error('Strategy error: ' + err.message);

            me._processPostDelivery();
        });
    }

    _processPostDelivery() {
        let me = this;

        this._deliveryTimer = setTimeout(function () {
            me._processDelivery();
        }, me.deliveryTimeout);
    }
}

module.exports = DeliveryManager;