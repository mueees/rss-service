'use strict';

let ERRORS = {
    request: {
        unexpectedResponse: {
            code: 1
        },
        errorStatusCode: {
            code: 2
        }
    },
    feedParser: {
        parseError: {
            code: 3
        }
    },
    feed: {
        unexpectedResponse: {
            code: 4,
            description: 'Unexpected load error'
        },
        errorStatusCode: {
            code: 5,
            description: 'Load error status code'
        },
        parseError: {
            code: 6,
            description: 'Cannot parse feed'
        },
        unknown: {
            code: 7,
            description: 'Unknown error'
        }
    }
};

exports.ERRORS = ERRORS;