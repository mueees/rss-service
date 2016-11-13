'use strict';

let CODES = {
    1: {
        code: 1
    },
    2: {
        code: 2
    },
    3: {
        code: 3
    },
    4: {
        code: 4,
        description: 'Unexpected load error',
        dataKeys: ['feedId']
    },
    5: {
        code: 5,
        description: 'Load error status code'
    },
    6: {
        code: 6,
        description: 'Cannot parse feed'
    },
    7: {
        code: 7,
        description: 'Unknown error'
    }
};

let ERRORS = {
    request: {
        unexpectedResponse: CODES[1],
        errorStatusCode: CODES[2]
    },
    feedParser: {
        parseError: CODES[3]
    },
    feed: {
        unexpectedResponse: CODES[4],
        errorStatusCode: CODES[5],
        parseError: CODES[6],
        unknown: CODES[7]
    }
};

function getByCode(code) {
    return CODES[4];
}

exports.ERRORS = ERRORS;
exports.getByCode = getByCode;