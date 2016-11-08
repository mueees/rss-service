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
            let feedParser = me._feedParserFactory.get({
                feedUrl: feed.url
            });

            Promise.all([
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

                resolve(newPosts);
            }).catch(reject);
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