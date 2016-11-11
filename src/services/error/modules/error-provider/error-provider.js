'use strict';

class ErrorProvider {
    constructor(ErrorResource) {
        this._ErrorResource = ErrorResource;
    }

    /**
     * errorData:
     * {
     *      code: 4,
     *      data: {
     *          ...
     *      }
     * }
     * */
    create(errorData) {
        let me = this;

        return new Promise(function (resolve, reject) {
            if (!errorData.code) {
                reject({
                    message: 'Cannot create error: no code'
                });
            } else {
                let error = new me._ErrorResource(errorData);
                error.createDate = new Date();
                error.nextDateAttempt = new Date();

                error.nextDateAttempt.setDate(error.nextDateAttempt.getDate() + error.attemptToFix * 2);

                error.save().then(resolve).catch(reject)
            }
        });
    }

    find(options) {
        return this._ErrorResource.find(options);
    }
}

module.exports = ErrorProvider;