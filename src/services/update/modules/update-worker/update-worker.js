'use strict';

let _ = require('lodash');

class Worker {
    constructor(feedParserFactory, postManager, log, ERRORS) {
        this._feedParserFactory = feedParserFactory;
        this._postManager = postManager;
        this._log = log;
        this._ERRORS = ERRORS;
    }

    /**
     * @param {Object} feed Feed object
     * @return {Array} Array with the new posts
     * */
    execute(feed) {
        let me = this;

        return new Promise(function (resolve, reject) {
            // initialize feed parser
            let feedParser = me._feedParserFactory.get({
                feedUrl: feed.link
            });

            Promise.all([
                // fetch feed page and parse
                feedParser.parse(),

                // get last saved post from the feed
                me._postManager.getLastPost(feed._id)
            ]).then(function (data) {
                let lastPost = data[1];
                let newPosts = [];

                if (!lastPost) {
                    newPosts = feedParser.feed.posts;
                } else {
                    newPosts = me._getNewPosts(feedParser.feed.posts, new Date(lastPost.publicDate));
                }

                _.each(newPosts, function (newPost) {
                    newPost.feedId = feed._id;
                });

                resolve(newPosts);
            }).catch(function (error) {
                me._log.error('Cannot update feed due to: ' + error.message);

                let errorData = {
                    code: me._ERRORS.feed.unknown.code,
                    data: {
                        feedId: feed._id
                    }
                };

                // TODO: return appropriate error
                if (error && error.code) {
                    switch (error.code) {
                        case me._ERRORS.request.unexpectedResponse.code:
                            errorData.code = me._ERRORS.feed.unexpectedResponse.code;

                            break;

                        case me._ERRORS.request.errorStatusCode.code:
                            errorData.code = me._ERRORS.feed.errorStatusCode.code;

                            break;

                        case me._ERRORS.feedParser.parseError.code:
                            errorData.code = me._ERRORS.feed.parseError.code;

                            break;
                    }
                }

                reject(errorData);
            });
        });
    }

    _getNewPosts(posts, date) {
        var newPosts = [];

        posts.forEach(function (post) {
            var postDate = new Date(post.publicDate);

            if (postDate > date) {
                newPosts.push(post);
            }
        });

        return newPosts;
    }
}

module.exports = Worker;