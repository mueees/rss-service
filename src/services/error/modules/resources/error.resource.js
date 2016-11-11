'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var errorSchema = new Schema({
    code: {
        type: Number,
        required: true
    },

    data: {
        type: Object,
        default: {}
    },

    attemptToFix: {
        type: Number,
        default: 0,
        required: true
    },

    nextDateAttempt: {
        type: Date,
        required: true
    },

    createDate: {
        type: Date,
        required: true
    }
});

var Error = mongoose.model('Error', errorSchema);

module.exports = Error;