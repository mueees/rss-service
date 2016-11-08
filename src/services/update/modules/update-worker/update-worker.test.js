'use strict';

let expect = require('chai').expect;
let log = require('mue-core/modules/log')(module);
let asyncCheck = require('mue-core/modules/test-helper').asyncCheck;
let ERRORS = require('../../../../modules/error').ERRORS;

let UpdateWorker = require('./update-worker');

describe('Update worker', function () {
    let feedParserFactory,
        postManager;

    beforeEach(function () {
        feedParserFactory = {
            get: function () {
                return {
                    parse: function () {
                        return {};
                    }
                };
            }
        };
        postManager = {
            getLastPost: function (postId) {

            }
        };
    });

    function getUpdateWorker() {
        return new UpdateWorker(feedParserFactory, postManager, log, ERRORS);
    }

    it('should return feed error unexpectedResponse', function (done) {
        feedParserFactory = {
            get: function () {
                return {
                    parse: function () {
                        return Promise.reject({
                            code: ERRORS.request.unexpectedResponse.code
                        });
                    }
                };
            }
        };

        let updateWorker = getUpdateWorker();

        updateWorker.execute({}).then(function () {
            done('Unknown error');
        }).catch(function (error) {
            asyncCheck(done, function () {
                expect(error.code).to.equal(ERRORS.feed.unexpectedResponse.code);
            });
        });
    });

    it('should return feed error errorStatusCode', function (done) {
        feedParserFactory = {
            get: function () {
                return {
                    parse: function () {
                        return Promise.reject({
                            code: ERRORS.request.errorStatusCode.code
                        });
                    }
                };
            }
        };

        let updateWorker = getUpdateWorker();

        updateWorker.execute({}).then(function () {
            done('Unknown error');
        }).catch(function (error) {
            asyncCheck(done, function () {
                expect(error.code).to.equal(ERRORS.feed.errorStatusCode.code);
            });
        });
    });

    it('should return feed error parseError', function (done) {
        feedParserFactory = {
            get: function () {
                return {
                    parse: function () {
                        return Promise.reject({
                            code: ERRORS.feedParser.parseError.code
                        });
                    }
                };
            }
        };

        let updateWorker = getUpdateWorker();

        updateWorker.execute({}).then(function () {
            done('Unknown error');
        }).catch(function (error) {
            asyncCheck(done, function () {
                expect(error.code).to.equal(ERRORS.feed.parseError.code);
            });
        });
    });

    it('should return feed error parseError', function (done) {
        feedParserFactory = {
            get: function () {
                return {
                    parse: function () {
                        return Promise.reject({});
                    }
                };
            }
        };

        let updateWorker = getUpdateWorker();

        updateWorker.execute({}).then(function () {
            done('Unknown error');
        }).catch(function (error) {
            asyncCheck(done, function () {
                expect(error.code).to.equal(ERRORS.feed.unknown.code);
            });
        });
    });
});