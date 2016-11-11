'use strict';

class ErrorDeliver {
    constructor(errorProvider) {
        this._errorProvider = errorProvider;
    }

    // TODO: finish error delivering
    getError() {
        return Promise.resolve();
        // this._errorProvider.find();
    }

}

module.exports = ErrorDeliver;