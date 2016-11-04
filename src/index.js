'use strict';

let updateService = require('./services/update');

let update = updateService();

let queue = require('./modules/queue').get();

let i = 0;

setInterval(function () {
    i++;

    queue.create('feed:update', {
        title: 'rendering frame #' + i
    }).save(function (err) {
        if (!err) {
            // console.log('add ' + i + ' job');
        }
    });
}, 100);