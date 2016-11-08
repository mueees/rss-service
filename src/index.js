'use strict';

/*CONFIG STAGE*/
if (process.env.NODE_ENV == 'development') {
    let path = require('path');

    // add another folder
    require('app-module-path').addPath(path.join(__dirname + './../../'));
}

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

// Enable services
let deliveryService = require('./services/delivery')();
let updateService = require('./services/update')();
