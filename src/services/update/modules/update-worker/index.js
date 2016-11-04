'use strict';

function getNewPosts(feedData) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(feedData);
        }, 1000);
    });
}

module.exports = getNewPosts;