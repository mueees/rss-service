'use strict';

class SaveWorker {
    constructor(postManager) {
        this._postManager = postManager;
    }

    execute(post) {
        return this._postManager.create(post);
    }
}

module.exports = SaveWorker;