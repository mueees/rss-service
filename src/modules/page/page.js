'use strict';

let url = require('url');
let _ = require('lodash');

/**
 * @description Store and get web page by url
 *
 * */
class Page {
    /**
     * @param {log} log
     * @param {loader} loader
     * @param {ERRORS} ERRORS
     * */
    constructor(log, loader, ERRORS) {

        // object that responsible for loading page
        this._loader = loader;

        this._log = log;

        // page url
        this.url = null;

        // page html
        this.page = null;

        // parsed page details
        this.pageDetails = null;

        // set of errors
        this.ERRORS = ERRORS;
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
                me._loader({
                    url: me.url,
                    fullResponse: true
                }).then(function (data) {
                    me.page = data.body;

                    resolve(me.page);
                }).catch(function (error) {
                    let errorData = {};

                    if (!_.get(error, 'response')) {
                        errorData.code = me.ERRORS.request.unexpectedResponse.code;
                        errorData.message = 'Unexpected response';
                    } else {
                        errorData.code = me.ERRORS.request.errorStatusCode.code;
                        errorData.message = 'Error status code';

                        errorData.data = {
                            statusCode: _.get(error, 'response.statusCode')
                        };
                    }

                    me._log.error('Cannot load page due to: ' + errorData.message);

                    reject(errorData);
                });
            });
        }
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