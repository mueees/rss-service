'use strict';

class ErrorQueueWorker {
    constructor() {

    }

    execute(errorData) {
        return Promise.resolve();
    }
}

module.exports = ErrorQueueWorker;