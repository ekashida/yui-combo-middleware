var vows    = require('vows');
var assert  = require('assert');
var mockery = require('mockery');
var suite   = vows.describe('middleware-error');
var next    = function () {};

mockery.registerMock('http', {
    STATUS_CODES: {}
});

mockery.enable({ useCleanCache: true });
mockery.registerAllowable('../../lib/middleware/error', true);
var mid = require('../../lib/middleware/error');
mockery.disable();

function generateMock () {
    return {
        req: {},
        res: {
            end: function () {}
        }
    };
}

suite.addBatch({
    'when the status code 200': {
        topic: function () {
            var mock = generateMock();
            mock.res.statusCode = 200;

            return {
                middleware: mid(),
                mock: mock
            };
        },
        'it is adjusted to 500': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(null, req, res, next);
            assert.equal(res.statusCode, 500);
        },
        'an error message is returned': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res,
                msg;

            res.end = function (m) {
                msg = m;
            };

            middleware(null, req, res, next);
            assert(msg);
        }
    },
    'when the status code is not 200': {
        topic: function () {
            var mock = generateMock(),
                code = 400;

            mock.res.statusCode = code;

            return {
                middleware: mid(),
                mock: mock,
                code: code
            };
        },
        'it is not adjusted': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(null, req, res, next);
            assert.equal(res.statusCode, o.code);
        },
        'an error message is returned': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res,
                msg;

            res.end = function (m) {
                msg = m;
            };

            middleware(null, req, res, next);
            assert(msg);
        }
    }
});

suite.export(module);
