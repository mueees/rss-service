'use strict';

let unfluff = require('unfluff');

/**
 * @description Store and extract page info
 * */
class PageParser {
    constructor(pageLoader, options) {
        options = options || {};

        this._pageLoader = pageLoader;

        this.page = options.page;
    }

    parse() {
        let me = this;

        return this._loadPage().then(function () {
            me.pageDetails = unfluff(me.page, 'en');

            return me.pageDetails;
        }).catch(function (error) {
            return Promise.reject(error);
        });
    }

    _loadPage() {
        let me = this;

        return new Promise(function (resolve, reject) {
            if (me.page) {
                resolve(me.page);
            } else {
                me._pageLoader.url = me.feedUrl;

                me._pageLoader.load().then(function () {
                    me.page = me._pageLoader.page;

                    resolve(me.page);
                }, reject);
            }
        });
    }
}

module.exports = PageParser;