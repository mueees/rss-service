'use strict';

let bodyParser = require('body-parser');

let config = require('../../config');
let feedManager = require('../../modules/feed-manager');
let postManager = require('../../modules/post-manager');

let apiServer = require('mue-core/modules/api-server');

module.exports = function (deliveryService, updateService, prepareService, saveService) {
    // initialize Http server
    apiServer({
        name: config.get('name'),
        port: config.get('network:port'),

        init: function (app) {
            app.use(bodyParser.urlencoded({extended: false}));

            require('./routes')(app);
        }
    });
};