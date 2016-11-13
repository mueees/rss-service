'use strict';

/**
 * Save the error to DB
 * */

let _ = require('lodash');

class ErrorQueueWorker {
    constructor(errorProvider, errorCode) {
        this._errorProvider = errorProvider;
        this._errorCode = errorCode;
    }

    execute(errorData) {
        let me = this;
        let query = this._makeQuery(errorData);

        return me._errorProvider.create(errorData).then(function () {
            return me._errorProvider.findOne(query).then(function (errorInstance) {
                // create the new error only if it doesn't have duplicate
                if (!errorInstance) {
                    return me._errorProvider.create(errorData);
                }
            }).catch(function (err) {
                return Promise.reject({
                    message: err.message
                })
            });
        });
    }

    // make query for finding the same error in the DB
    _makeQuery(errorData) {
        let query = {
            code: errorData.code
        };

        let errorDescriptor = this._errorCode.getByCode(errorData.code);

        // if error contains additional data, add it to the request
        if (errorDescriptor.dataKeys) {
            query.data = {};

            _.each(errorDescriptor.dataKeys, function (dataKey) {
                query.data[dataKey] = errorData.data[dataKey];
            });
        }

        return query;
    }
}

module.exports = ErrorQueueWorker;