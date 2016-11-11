'use strict';

let _ = require('lodash');

class ErrorCustomer {
    constructor(errorProvider) {
        this._errorProvider = errorProvider;

        this._attempTimeDelay = 5; // 5 minute

        this._maxAttemptScale = 10;

        // ids that were sent to fixing
        this._providedErrorIds = [];
    }

    /**
     * Should return error instance.
     * Takes all errors that have expired nextDateAttempt date and return the most ancient
     *
     * Example: time line
     * \-----(1th error)---(2th error)----\now\---future-----\
     * Should return 1th error
     * */
    getError() {
        let me = this;

        return this._errorProvider.getExpiredNextDateAttempt().then(function (errors) {
            // filter it
            if (_.isEmpty(errors)) {
                return null;
            } else {
                let error = me._getOlderError(_.sortBy(errors, 'nextDateAttempt'));

                if (error) {
                    me._providedErrorIds.push(error._id);

                    return error;
                } else {
                    return null;
                }
            }
        }).catch(function (error) {
            return Promise.reject(error);
        });
    }

    // return the most older error
    _getOlderError(errors) {
        let error = null;

        for (var i = 0; i < errors.length; i++) {
            if (this._providedErrorIds.indexOf(errors[i]) === -1) {
                error = errors[i];

                break;
            }
        }

        if (error) {
            error = error.toObject();
            error._id = error._id.toString();
        }

        return error;
    }

    processResolvedError(errorInstance) {
        this._providedErrorIds = _.remove(this._providedErrorIds, errorInstance._id);

        return this._errorProvider.removeById(errorInstance._id);
    }

    processUnResolvedError(errorInstance) {
        errorInstance.attemptToFix += 1;

        let attemptScale;

        // attempt scale: 5, 10, 15, ... 50, 50, 50 ..
        if (errorInstance.attemptToFix > this._maxAttemptScale) {
            attemptScale = this._attempTimeDelay * this._maxAttemptScale;
        } else {
            attemptScale = this._attempTimeDelay * errorInstance.attemptToFix;
        }

        errorInstance.nextDateAttempt = new Date();
        errorInstance.nextDateAttempt.setMinutes(errorInstance.nextDateAttempt.getMinutes() + attemptScale);

        return this._errorProvider.edit(errorInstance);
    }
}

module.exports = ErrorCustomer;