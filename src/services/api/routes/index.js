'use strict';

let _ = require('lodash');

let config = require('../../../config');
let queue = require('../../../modules/queue');
let errorManager = require('mue-core/modules/error');
let log = require('mue-core/modules/log')(module);

const API_PREFIX = '/api';

module.exports = function (app) {
    app.get(API_PREFIX + '/info', function (request, response, next) {
        response.send('Rss Services');
    });

    // Queue
    app.get(API_PREFIX + '/queue/:queueName/job/count', function (request, response, next) {
        queue.count([
            request.params.queueName
        ]).then(function (jobCount) {
            response.send({
                count: jobCount
            });
        }).catch(function (error) {
            log.error(error.message);

            errorManager.getHttpError(error.message);
        });
    });

    app.get(API_PREFIX + '/queue/job/count', function (request, response, next) {
        queue.count([
            config.get('queues:updateFeed'),
            config.get('queues:preparePost'),
            config.get('queues:savePost')
        ]).then(function (jobCount) {
            response.send({
                count: jobCount
            });
        }).catch(function (error) {
            log.error(error.message);

            errorManager.getHttpError(error.message);
        });
    });
};