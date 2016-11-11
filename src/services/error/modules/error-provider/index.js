'use strict';

let ErrorProvider = require('./error-provider');
let ErrorResource = require('../resources').ErrorResource;

module.exports = new ErrorProvider(ErrorResource);
