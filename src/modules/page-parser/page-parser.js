'use strict';

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

module.exports = PageParser;