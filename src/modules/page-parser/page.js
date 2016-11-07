'use strict';

let url = require('url');

/**
 * @description Store and get web page by url
 *
 * */
class Page {
    /**
     * @param {PageParser} parser Html parser
     * @param {log} log
     * */
    constructor(parser, log, loader) {
        // parser object that is responsible for extracting data from the page
        this.parser = parser;

        // object that responsible for loading page
        this.loader = loader;

        this.log = log;

        // page url
        this.url = null;

        // page html
        this.page = null;

        // parsed page details
        this.pageDetails = null;
    }

    /**
     * @desc Download the page
     * */
    load() {
        let me = this;

        if (this.page) {
            return Promise.resolve(this.page);
        } else {
            return new Promise(function (resolve, reject) {
                me.loader({
                    url: me.url,
                    fullResponse: true
                }).then(function (data) {
                    me.page = data.body;

                    resolve(me.page);
                }).catch(function (error) {
                    let message = error.message || 'unknown reason';

                    if (error.response.statusCode === 404) {
                        message = '404 response';
                    }

                    me.log.error('Cannot load page due to: ' + message);

                    reject({
                        message: 'Cannot load page due to: ' + message
                    });
                });
            });
        }
    }

    parse() {
        let me = this;

        return this.load().then(function () {
            me.parser.page = me.page;

            me.pageDetails = me.parser.parse();
        });
    }

    static getDomain(link) {
        var domain = '';

        if (link) {
            var parsed = url.parse(link);

            domain = (parsed.protocol && parsed.host) ? parsed.protocol + '//' + parsed.host : '';
        }

        return domain;
    }
}

module.exports = Page;