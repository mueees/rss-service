'use strict';

let url = require('url');

class PreparePostWorker {
    constructor(pageParserFactory, log, ERRORS) {
        this._pageParserFactory = pageParserFactory;
        this._log = log;
        this._ERRORS = ERRORS;
    }

    execute(post) {
        let me = this;

        // strip the query string
        post.link = url.parse(post.link).pathname;

        // remove trailing slash
        post.link = post.link.replace(/\/$/, '');

        // TODO: implement more
        return new Promise(function (resolve, reject) {
            resolve(post);
        });
    }
}

module.exports = PreparePostWorker;