'use strict';

let WorkManager = require('./../../../../modules/work-manager');

class UpdateManager extends WorkManager {
    postSuccessHandler(items, job) {
        this._log.debug(job.data.title + ' feed was updated');
    }

    postFailedHandler(error, job) {
        this._log.error('Cannot update ' + job.data.title + ' feed due to: ' + error.message);
    }
}

module.exports = UpdateManager;