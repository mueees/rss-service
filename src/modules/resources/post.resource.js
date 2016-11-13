'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var postSchema = new Schema({
    title: {
        type: String
    },

    body: {
        type: String
    },

    link: {
        type: String,
        required: true, // empty string is invalid
        unique: true
    },

    description: {
        type: String,
        default: ''
    },

    // date when post was published
    publicDate: {
        type: Date,
        default: new Date()
    },

    // date when post was added to DB
    createDate: {
        type: Date,
        default: new Date()
    },

    feedId: {
        type: ObjectId,
        required: true
    },

    image: {
        type: String
    }
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;