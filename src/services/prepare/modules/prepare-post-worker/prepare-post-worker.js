'use strict';

class PreparePostWorker {
    constructor(pageParserFactory, log, ERRORS) {
        this._pageParserFactory = pageParserFactory;
        this._log = log;
        this._ERRORS = ERRORS;
    }

    execute(post) {
        let me = this;

        // TODO: imlement more
        return new Promise(function (resolve, reject) {
            resolve(post);
        });
    }
}

module.exports = PreparePostWorker;