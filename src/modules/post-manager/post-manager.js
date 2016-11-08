'use strict';

class PostManager {
    constructor(PostResource, log) {
        this._PostResource = PostResource;

        this._log = log;
    }

    getLastPost(feedId) {
        let me = this;

        return new Promise(function (resolve, reject) {
            me._PostResource.findOne({
                feedId: feedId
            }, {}, {
                sort: {
                    public_date: -1
                }
            }).then(function (post) {
                resolve(post);
            }).catch(function (error) {
                me._log.error(error.message);

                reject({
                    message: error.message
                });
            });
        });
    }
}

module.exports = PostManager;