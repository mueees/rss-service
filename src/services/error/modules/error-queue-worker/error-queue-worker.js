'use strict';

/**
 * Save the error to DB
 * */

class ErrorQueueWorker {
    constructor(errorProvider) {
        this._errorProvider = errorProvider;
    }

    execute(errorData) {
        return this._errorProvider.create(errorData);
    }
}

module.exports = ErrorQueueWorker;