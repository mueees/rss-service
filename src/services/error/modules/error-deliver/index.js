'use strict';

let ErrorDeliver = require('./error-deliver');
let errorProvider = require('../error-provider');

module.exports = new ErrorDeliver(errorProvider);