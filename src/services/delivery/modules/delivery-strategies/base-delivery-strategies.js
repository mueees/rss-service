'use strict';

class BaseDeliveryStrategy {
    execute() {
        throw new Error('Method execute must be implemented');
    }
}

module.exports = BaseDeliveryStrategy;