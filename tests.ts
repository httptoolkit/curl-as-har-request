import { expect } from 'chai';
import { parseCurlCommand } from './index.js';

describe("Curl parsing", () => {
    it("should be able to parse a minimal GET request", () => {
        expect(
            parseCurlCommand('curl http://example.com')
        ).to.deep.equal([{
            method: 'GET',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            cookies: [],
            headers: [],
            queryString: [],
            headersSize: -1,
            bodySize: 0,
        }]);
    })
})