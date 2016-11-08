'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var feedSchema = new Schema({
    title: {
        type: String
    },

    description: {
        type: String
    },

    link: {
        type: String,
        required: true,
        unique: true
    },

    language: {
        type: String,
        default: 'en'
    },

    image: {
        type: String
    },

    addDate: {
        type: Date
    }
});

var Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;