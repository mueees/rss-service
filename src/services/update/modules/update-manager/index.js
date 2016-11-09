'use strict';

let WorkManager = require('./../../../../modules/work-manager');

class UpdateManager extends WorkManager {
    postSuccessHandler(items, job) {
        this._log.debug(items.length + ' new posts for ' + job.data.title + ' feed were added');
    }

    postFailedHandler(error, job) {
        this._log.error('Cannot update ' + job.data.title + ' feed due to: ' + error.message);
    }
}

module.exports = UpdateManager;