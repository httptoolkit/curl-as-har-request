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
            }, {
                name: 'Accept',
                'value': '*/*'
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
                name: 'Accept',
                'value': '*/*'
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
                name: 'Accept',
                'value': '*/*'
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
            cookies: [],
            queryString: [],
            headersSize: -1,
            bodySize: -1
        }]);
    });

    it("should be able to parse a JSON body request with -d", () => {
        expect(
            parseCurlCommand('curl -X POST -H "Content-Type: application/json" -d \'{"key":"value"}\' http://example.com')
        ).to.deep.equal([{
            method: 'POST',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            cookies: [],
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
            queryString: [],
            postData: {
                mimeType: "application/json",
                text: '{"key":"value"}'
            },
            bodySize: -1,
            headersSize: -1
        }]);
    });

    it("should be able to parse a JSON body request with --json", () => {
        expect(
            parseCurlCommand('curl -X POST --json \'{"key":"value"}\' http://example.com')
        ).to.deep.equal([{
            method: 'POST',
            url: 'http://example.com',
            httpVersion: 'HTTP/1.1',
            cookies: [],
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
            queryString: [],
            postData: {
                mimeType: "application/json",
                text: '{"key":"value"}'
            },
            bodySize: -1,
            headersSize: -1
        }]);
    });

});