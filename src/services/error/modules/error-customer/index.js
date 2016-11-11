'use strict';

let ErrorCustomer = require('./error-customer');
let errorProvider = require('../error-provider');

module.exports = new ErrorCustomer(errorProvider);