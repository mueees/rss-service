'use strict';

/*
 * The main file, will be executed as separated node service
 *
 * Data that should be available from admin panel
 * - count of workers
 * - average time for processing
 *
 * Methods:
 * - change workers number
 * - pause work
 * - resume work
 * */

var UpdateManager = require('./modules/update-manager').UpdateManager;

let updateManager = new UpdateManager({
    workers: 50
});

updateManager.initialize().then(function () {
    console.log('Update manager was initialized');
}).catch(function (err) {
    console.log('Cannot initialize Update manager due to ' + err.message);
});