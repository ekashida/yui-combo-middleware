var vows    = require('vows');
var assert  = require('assert');
var suite   = vows.describe('middleware-done');
var next    = function () {};
var mid     = require('../../lib/middleware/done');

function generateMock () {
    return {
        req: {},
        res: {
            locals: {
                startTime: process.hrtime()
            },
            setHeader: function (key, value) {
                this[key] = value;
            },
            end: function () {}
        }
    };
}

suite.addBatch({
    'when the body is missing': {
        topic: function () {
            var mock = generateMock();

            return {
                middleware: mid(),
                mock: mock
            };
        },
        'the status code is 500': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.equal(res.statusCode, 500);
        },
        'an error is passed': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res,
                error;

            middleware(req, res, function (err) {
                error = err;
            });
            assert(error instanceof Error);
        }
    },
    'when the file type is js': {
        topic: function () {
            var mock = generateMock();
            mock.res.locals.type = 'js';
            mock.res.locals.body = 'body';

            return {
                middleware: mid(),
                mock: mock
            };
        },
        'the content type is correct': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.equal(
                res['Content-Type'],
                'application/javascript;charset=utf-8'
            );
        }
    },
    'when the file type is css': {
        topic: function () {
            var mock = generateMock();
            mock.res.locals.type = 'css';
            mock.res.locals.body = 'body';

            return {
                middleware: mid(),
                mock: mock
            };
        },
        'the content type is correct': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.equal(
                res['Content-Type'],
                'text/css;charset=utf-8'
            );
        }
    },
    'when the file type is unrecognized': {
        topic: function () {
            var mock = generateMock();
            mock.res.locals.type = 'java';
            mock.res.locals.body = 'body';

            return {
                middleware: mid(),
                mock: mock
            };
        },
        'the content type defaults to javascript': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.equal(
                res['Content-Type'],
                'application/javascript;charset=utf-8'
            );
        }
    },
    'when the request looks normal': {
        topic: function () {
            var mock = generateMock();
            mock.res.locals.type = 'js';
            mock.res.locals.body = 'body';

            return {
                middleware: mid(),
                mock: mock
            };
        },
        'the cache control header is set': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert(res['Cache-Control']);
        },
        'the expires header is set': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert(res.Expires);
        },
        'the vary header is set': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert(res.Vary);
        },
        'the content type header is set': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert(res['Content-Type']);
        },
        'the status code is 200': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.equal(res.statusCode, 200);
        },
        'the body is passed': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res,
                resBody;

            res.end = function (body) {
                resBody = body;
            };

            middleware(req, res, next);
            assert.equal(resBody, res.locals.body);
        }
    }
});

suite.export(module);
