'use strict';

let WorkManager = require('./../../../../modules/work-manager');

class PrepareManager extends WorkManager {
    postSuccessHandler(items, job) {
        this._log.debug(items.length + ' posts were updated');
    }

    postFailedHandler(error, job) {
        this._log.error('Cannot update ' + job.data.title + ' post due to: ' + error.message);
    }
}

module.exports = PrepareManager;