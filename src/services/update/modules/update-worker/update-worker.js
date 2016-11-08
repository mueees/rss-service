'use strict';

class Worker {
    constructor(feedParserFactory, postManager, log) {
        this._feedParserFactory = feedParserFactory;
        this._postManager = postManager;
        this._log = log;
    }

    /**
     * @param {Object} feed Feed object
     * @return {Array} Array with the new posts
     * */
    execute(feed) {
        let me = this;

        return new Promise(function (resolve, reject) {
            // initialize feed parser
            let feedParser = this._feedParserFactory.get({
                feedUrl: feed.url
            });

            Promise.all([
                feedParser.parse(),

                // get last saved post from the feed
                this._postManager.getLastPost(feed._id)
            ]).then(function (data) {
                let feedData = data[0];
                let lastPost = data[1];



                resolve([]);
            }).catch(function () {
                reject([]);
            });
        });
    }
}

module.exports = Worker;