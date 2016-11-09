'use strict';

let DELIVERY_MANAGER = require('./delivery-manager.constant');

/**
 * The main class for managing feed delivering
 * Pass feed to the update queue.
 *
 * Support one strategy type:
 * - strategy that choose which feed should be added to update
 *
 *
 *
 * Improvements:
 * - strategy that allow or disallow add feed to update
 *
 * */

class DeliveryManager {
    constructor(options) {
        this._outcomingQueue = options.outcomingQueue;

        // A Number, representing the ID value of the timer
        this._deliveryTimer = null;

        // map of strategies
        this._strategies = {};

        // current strategy name
        this._strategyName = null;

        // service for logging
        this._log = options.log;

        this.deliveryTimeout = options.deliveryTimeout || DELIVERY_MANAGER.defaultDeliveryTimeout;
    }

    /**
     * Add feed to update
     * */
    addFeedToUpdate(feed) {
        let me = this;

        return new Promise(function (resolve, reject) {
            me._outcomingQueue.add(feed);

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
        this._stopDeliveryLoop();
    }

    /*
     * Start adding new feed for update
     * */
    start() {
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

    _getCurrentStrategy() {
        return this._strategies[this._strategyName];
    }

    /**
     * Executed every delivery timeout period
     * */
    _processDelivery() {
        let me = this;

        this._canDeliveryFeed().then(function () {
            let strategy = me._getCurrentStrategy();

            strategy.execute().then(function (feed) {
                if (!feed) {
                    me._log.info('There is no feed for update');

                    me._processPostDelivery();
                } else {
                    me.addFeedToUpdate(feed).then(function () {
                        me._log.info(feed.title + ' was added to update');

                        me._processPostDelivery();
                    }).catch(function (error) {
                        me._log.error('Cannot add feed to update due to: ' + error.message);

                        me._processPostDelivery();
                    });
                }
            }).catch(function (err) {
                me._log.error('Strategy error: ' + err.message);

                me._processPostDelivery();
            })
        }).catch(function (err) {
            me._log.info('Cannot process delivery due to: ' + err.message);
        });
    }

    _canDeliveryFeed() {
        return Promise.resolve();
    }

    _processPostDelivery() {
        let me = this;

        this._deliveryTimer = setTimeout(function () {
            me._processDelivery();
        }, me.deliveryTimeout);
    }
}

module.exports = DeliveryManager;