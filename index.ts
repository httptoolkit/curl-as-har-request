import type * as Har from 'har-format';

import { convert } from './parser.js';

export class HarParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HarParseError';
    }
}

export function parseCurlCommand(curlCommand: string): Har.Request[] {
    const parserResult = convert(curlCommand);

    if (parserResult === null) {
        throw new HarParseError('Failed to parse cURL command');
    }

    return parserResult.map((req): Har.Request => {
        return {
            method: req.method,
            url: req.url,
            httpVersion: 'HTTP/1.1',
            cookies: [],
            headers: req.headers,
            queryString: [],
            headersSize: -1,
            bodySize: 0
        };
    });
}