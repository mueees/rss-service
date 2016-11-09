'use strict';

/*RUN STAGE*/
let config = require('./config');

// log Uncaught exception, Unhandled Rejection
require('mue-core/modules/debug');

// connect to DB
require('./modules/db').initConnection({
    port: config.get('db:port'),
    name: config.get('db:name'),
    host: config.get('db:host')
});

// initialize feeds
// require('./initialization').init();

// Enable services
let deliveryService = require('./services/delivery')();
let updateService = require('./services/update')();
let prepareService = require('./services/prepare')();
let saveService = require('./services/save')();
let apiService = require('./services/api')(deliveryService, updateService, prepareService, saveService);