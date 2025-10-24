# curl-as-har-request

A JS library to turn a Curl command string into a HAR request object

This library is designed to provide access to a standard model of the core data of a request from a curl command. It supports:

* Basic parameters like method, url & default headers (e.g. Host & Accept)
* Body details, including multipart form bodies, URL encoded bodies, and JSON bodies
* Cookie parameters
* HTTP basic authentication parameters
* Multiple semi-colon separated commands in one string
* HTTP version negotiation with `--http2`
* Accepting compressed responses with `--compressed`
* Correctly parsing shell strings with escaping etc

There are a few HAR features that are _not_ supported:

* Exposing cookies in the `cookies` HAR property - instead these are just included in the `headers` property
* Exposing query params in the `queryString` HAR property - instead these are just included in the query string of the `url` property
* `headerSize` and `bodySize`

If you find any cases that are not parsed correctly, please open an issue or a pull request.