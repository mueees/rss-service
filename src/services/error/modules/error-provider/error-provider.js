'use strict';

class ErrorProvider {
    constructor(ErrorResource, log) {
        this._ErrorResource = ErrorResource;
        this._log = log;
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

                error.save().then(resolve).catch(reject)
            }
        });
    }

    getExpiredNextDateAttempt() {
        let me = this;

        return this._ErrorResource.find({
            nextDateAttempt: {
                $lt: new Date()
            }
        }).then(function (errors) {
            return errors;
        }).catch(function (error) {
            me._log.error(error.message);

            return Promise.reject({
                message: 'Cannot get errors: ' + error.message
            });
        });
    }

    findOne(query) {
        return this._ErrorResource.findOne(query);
    }

    removeById(errorId) {
        return this._ErrorResource.remove({
            _id: errorId
        });
    }

    edit(errorInstance) {
        let _id = errorInstance._id;

        // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
        delete errorInstance._id;

        return this._ErrorResource.findOneAndUpdate({
            _id: _id
        }, errorInstance);
    }
}

module.exports = ErrorProvider;