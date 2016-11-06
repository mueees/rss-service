'use strict';

let requestPromise = require('mue-core/modules/request-promise');
let log = require('mue-core/modules/log')(module);
let url = require('url');

/**
 * @description Store and get web page by url
 *
 * */
class Page {
    /**
     * @param {String} url Web page url
     * */
    constructor(url) {
        this.url = url;

        this.page = null;
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
                requestPromise({
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

                    log.error('Cannot load page due to: ' + message);

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
            let parser = new PageParser(me.page);

            me.pageDetails = parser.parse();
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

let unfluff = require('unfluff');

/**
 * @description Store and extract page info
 * */
class PageParser {
    constructor(page) {
        this.page = page;
    }

    parse() {
        this.pageInfo = unfluff(this.page, 'en');

        return this.pageInfo;
    }
}

exports.Page = Page;