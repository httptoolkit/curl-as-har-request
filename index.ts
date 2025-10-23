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
        const body = Object.keys(req.body).length === 0
            ? undefined
            : req.body as Har.PostData;


        if (body?.mimeType && !req.headers.find(h => h.name.toLowerCase() === 'content-type')) {
            req.headers.push({ name: 'Content-Type', value: body.mimeType });
        }

        if (req.authentication.username || req.authentication.password) {
            // Convert to base64 in a browser-compatible way:
            const encodedAuth = btoa(`${req.authentication!.username || ''}:${req.authentication!.password || ''}`);
            req.headers.push({ name: 'Authorization', value: `Basic ${encodedAuth}` });
        }

        return {
            method: req.method,
            url: req.url,
            httpVersion: 'HTTP/1.1',
            headers: req.headers,
            postData: body,
            cookies: [],
            queryString: [],
            headersSize: -1,
            bodySize: -1
        };
    });
}