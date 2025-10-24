import { expect } from 'chai';
import { parseCurlCommand } from './index.js';

const FIXED_VALUES = {
    cookies: [],
    queryString: [],
    headersSize: -1,
    bodySize: -1
};

describe("Curl parsing", () => {
    it("should be able to parse a minimal GET request", () => {
        expect(
            parseCurlCommand('curl http://example.com')
        ).to.deep.equal([{
            method: 'GET',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            headers: [{
                name: 'Host',
                value: 'example.com'
            }, {
                name: 'Accept',
                'value': '*/*'
            }],
            postData: undefined,
            ...FIXED_VALUES
        }]);
    });

    it("should be able to parse a POST request", () => {
        expect(
            parseCurlCommand('curl -X POST -d "hello world" http://example.com')
        ).to.deep.equal([{
            method: 'POST',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            headers: [{
                name: 'Host',
                value: 'example.com'
            }, {
                name: 'Accept',
                'value': '*/*'
            }, {
                name: 'Content-Type',
                value: 'application/x-www-form-urlencoded'
            }],
            postData: {
                mimeType: "application/x-www-form-urlencoded",
                text: "hello world"
            },
            ...FIXED_VALUES
        }]);
    });

    it("should be able to parse a request with basic auth", () => {
        expect(
            parseCurlCommand('curl -u user:pass http://example.com')
        ).to.deep.equal([{
            method: 'GET',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            headers: [{
                name: 'Host',
                value: 'example.com'
            }, {
                name: 'Accept',
                'value': '*/*'
            }, {
                name: 'Authorization',
                value: 'Basic dXNlcjpwYXNz'
            }],
            postData: undefined,
            ...FIXED_VALUES
        }]);
    });

    it("should be able to parse a request with -G URL params", () => {
        expect(
            parseCurlCommand('curl -G -d "param1=value1" -d "param2=value2" http://example.com/?a=1')
        ).to.deep.equal([{
            method: 'GET',
            url: 'http://example.com/?a=1&param1=value1&param2=value2',
            httpVersion: 'HTTP/1.1',
            headers: [{
                name: 'Host',
                value: 'example.com'
            }, {
                name: 'Accept',
                'value': '*/*'
            }],
            postData: undefined,
            ...FIXED_VALUES
        }]);
    });

    it("should be able to parse a JSON body request with -d", () => {
        expect(
            parseCurlCommand('curl -X POST -H "Content-Type: application/json" -d \'{"key":"value"}\' http://example.com')
        ).to.deep.equal([{
            method: 'POST',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            headers: [{
                name: 'Host',
                value: 'example.com'
            }, {
                name: 'Accept',
                'value': '*/*'
            }, {
                name: 'Content-Type',
                value: 'application/json'
            }],
            postData: {
                mimeType: "application/json",
                text: '{"key":"value"}'
            },
            ...FIXED_VALUES
        }]);
    });

    it("should be able to parse a JSON body request with --json", () => {
        expect(
            parseCurlCommand('curl -X POST --json \'{"key":"value"}\' http://example.com')
        ).to.deep.equal([{
            method: 'POST',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            headers: [{
                name: 'Host',
                value: 'example.com'
            }, {
                name: 'Accept',
                value: 'application/json'
            }, {
                name: 'Content-Type',
                value: 'application/json'
            }],
            postData: {
                mimeType: "application/json",
                text: '{"key":"value"}'
            },
            ...FIXED_VALUES
        }]);
    });

    it("should detect HTTP/2 command line flags", () => {
        expect(
            parseCurlCommand('curl --http2 https://example.com/?a=1')
        ).to.deep.equal([{
            method: 'GET',
            url: 'https://example.com/?a=1',
            httpVersion: 'HTTP/2',
            headers: [{
                name: ':method',
                value: 'GET'
            }, {
                name: ':scheme',
                value: 'https'
            }, {
                name: ':authority',
                value: 'example.com'
            }, {
                name: ':path',
                value: '/?a=1'
            }, {
                name: 'Accept',
                'value': '*/*'
            }],
            postData: undefined,
            ...FIXED_VALUES
        }]);
    });

    it("should support cookies in the request", () => {
        expect(
            parseCurlCommand('curl -b "sessionid=abc123; csrftoken=def456" http://example.com')
        ).to.deep.equal([{
            method: 'GET',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            headers: [{
                name: 'Host',
                value: 'example.com'
            }, {
                name: 'Accept',
                'value': '*/*'
            }, {
                name: 'Cookie',
                value: 'sessionid=abc123; csrftoken=def456'
            }],
            postData: undefined,
            ...FIXED_VALUES
        }]);
    });

    it("should handle multiple requests in one command", () => {
        expect(
            parseCurlCommand('curl http://testserver.com; curl http://example.org')
        ).to.deep.equal([{
            method: 'GET',
            url: 'http://testserver.com',
            httpVersion: 'HTTP/1.1',
            headers: [{
                name: 'Host',
                value: 'testserver.com'
            }, {
                name: 'Accept',
                'value': '*/*'
            }],
            postData: undefined,
            ...FIXED_VALUES
        }, {
            method: 'GET',
            url: 'http://example.org',
            httpVersion: 'HTTP/1.1',
            headers: [{
                name: 'Host',
                value: 'example.org'
            }, {
                name: 'Accept',
                'value': '*/*'
            }],
            postData: undefined,
            ...FIXED_VALUES
        }]);
    });

});