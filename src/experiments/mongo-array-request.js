'use strict';

require('../modules/db').initConnection({
    port: '27017',
    name: 'experiment',
    host: '127.0.0.1'
});