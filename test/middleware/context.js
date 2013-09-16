var vows    = require('vows');
var assert  = require('assert');
var suite   = vows.describe('middleware-context');
var next    = function () {};
var mid     = require('../../lib/middleware/context');

function generateMock () {
    return {
        req: {
            query: {},
            headers: {}
        },
        res: {}
    };
}

suite.addBatch({
    'when http url and secure switch undefined': {
        topic: function () {
            var mock = generateMock();
            mock.req.headers.via = 'http://example.com';

            return {
                middleware: mid({}),
                mock: mock
            };
        },
        'secure mode is not activated': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert(!req.comboSecure);
        }
    },
    'when http url and secure switch on': {
        topic: function () {
            var mock = generateMock();
            mock.req.query.secure = '1';
            mock.req.headers.via = 'http://example.com';

            return {
                middleware: mid({}),
                mock: mock
            };
        },
        'secure mode is activated': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert(req.comboSecure);
        }
    },
    'when https url and secure switch undefined': {
        topic: function () {
            var mock = generateMock();
            mock.req.headers.via = 'https://example.com';

            return {
                middleware: mid({}),
                mock: mock
            };
        },
        'secure mode is activated': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert(req.comboSecure);
        }
    },
    'when https url and secure switch on': {
        topic: function () {
            var mock = generateMock();
            mock.req.query.secure = '1';
            mock.req.headers.via = 'https://example.com';

            return {
                middleware: mid({}),
                mock: mock
            };
        },
        'secure mode is activated': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert(req.comboSecure);
        }
    }
});

suite.export(module);
