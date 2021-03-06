'use strict';

/**
 * Abstract manager
 * Doesn't know where the error is stored...
 * Manage only general process of fixing
 *
 * */
class ErrorManager {
    constructor(log, errorQueue, errorQueueWorker, errorCustomer, fixingTimeout) {
        let me = this;

        this._log = log;
        this._errorCustomer = errorCustomer;
        this._errorQueueWorker = errorQueueWorker;
        this._errorWorkers = {};
        this._fixingTimeout = fixingTimeout;

        // process new errors from the queue
        errorQueue.process(function (job, done) {
            me._processError(job, done)
        });
    }

    // start planned fixing
    startScheduleFixing() {
        this._processScheduleFixing();
    }

    stopScheduleFixing() {
        if (this._scheduleFixingTimer) {
            clearTimeout(this._scheduleFixingTimer);
        }
    }

    registerErrorWorker(code, worker) {
        this._errorWorkers[code] = worker;
    }


    fixErrorById(errorId) {
        // TODO: should find appropriate worker
        return Promise.reject();
    }

    /**
     * Take error resource as the parameter
     * Choose which worker should try to fix it, and return the result.
     * Doesn't know how exactly error will be fixed, as well as where how success or error result
     * will be processed at the next.
     *
     * Public method, could be executed from the admin ui.
     * */
    fixError(errorInstance) {
        if (errorInstance.code) {
            let worker = this._errorWorkers[errorInstance.code];

            if (worker) {
                return this._errorWorkers[errorInstance.code].fix(errorInstance.data);
            } else {
                return Promise.reject({
                    message: 'No error worker for error with code: ' + errorInstance.code
                });
            }
        } else {
            return Promise.reject({
                message: 'Wrong error, cannot find error code'
            });
        }
    }

    /**
     * Main method for processing incoming errors
     *
     * Error should be stored as soon as possible.
     * Delivery manager can filter feeds which marked as error
     * */
    _processError(job, done) {
        // TODO-imp: different type of errors could process different worker
        // maybe not all errors should be stored to DB

        let me = this;

        this._errorQueueWorker.execute(job.data).then(function () {
            me._log.info('Error was successfully processed');

            done();
        }).catch(function (error) {
            me._log.error('Cannot process error: ' + error.message);

            done();
        });
    }

    /**
     * Take next error from the DB and try to fix it
     * */
    _processScheduleFixing() {
        let me = this;

        this._errorCustomer.getError().then(function (errorInstance) {
            if (errorInstance) {
                me.fixError(errorInstance).then(function () {
                    me._log.info('The error was fixed');

                    me._errorCustomer.processResolvedError(errorInstance).then(function () {
                        me._postScheduleFixing();
                    }).catch(function (error) {
                        me._log.error('Cannot process resolver error: ' + error.message);

                        me._postScheduleFixing();
                    });
                }).catch(function (error) {
                    me._log.error('Cannot fix error: ' + error.message);

                    me._errorCustomer.processUnResolvedError(errorInstance).then(function () {
                        me._postScheduleFixing();
                    }).catch(function () {
                        me._log.error('Cannot process un-resolver error: ' + error.message);

                        me._postScheduleFixing();
                    });
                });
            } else {
                me._log.info('There is no error for fixing');

                me._postScheduleFixing();
            }
        }).catch(function (error) {
            me._postScheduleFixing();

            me._log.error('Cannot deliver error: ' + error.message)
        });
    }

    _postScheduleFixing() {
        let me = this;

        this._scheduleFixingTimer = setTimeout(function () {
            me._processScheduleFixing();
        }, this._fixingTimeout);
    }
}

module.exports = ErrorManager;