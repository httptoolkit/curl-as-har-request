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
            headers: [{
                name: 'Host',
                value: 'example.com'
            }],
            postData: undefined,
            queryString: [],
            headersSize: -1,
            bodySize: -1
        }]);
    });

    it("should be able to parse a POST request", () => {
        expect(
            parseCurlCommand('curl -X POST -d "hello world" http://example.com')
        ).to.deep.equal([{
            method: 'POST',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            cookies: [],
            headers: [{
                name: 'Host',
                value: 'example.com'
            }, {
                name: 'Content-Type',
                value: 'application/x-www-form-urlencoded'
            }],
            queryString: [],
            postData: {
                mimeType: "application/x-www-form-urlencoded",
                text: "hello world"
            },
            bodySize: -1,
            headersSize: -1
        }]);
    });

    it("should be able to parse a request with basic auth", () => {
        expect(
            parseCurlCommand('curl -u user:pass http://example.com')
        ).to.deep.equal([{
            method: 'GET',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            cookies: [],
            headers: [{
                name: 'Host',
                value: 'example.com'
            }, {
                name: 'Authorization',
                value: 'Basic dXNlcjpwYXNz'
            }],
            postData: undefined,
            queryString: [],
            headersSize: -1,
            bodySize: -1
        }]);
    });

});