'use strict';

class UpdateWorker {
    execute(data) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(data);
            }, 1000);
        });
    }
}

module.exports = UpdateWorker;