var vows    = require('vows');
var assert  = require('assert');
var suite   = vows.describe('middleware-init');
var next    = function () {};

var mid = require('../../lib/middleware/init');

function generateMock () {
    return {
        req: {
            url: {}
        },
        res: {}
    };
}

suite.addBatch({
    'when url is valid': {
        topic: function () {
            var mock = generateMock();
            mock.req.url = 'http://example.com/hoge?foo=bar&baz=qux';

            return {
                middleware: mid(),
                mock: mock
            };
        },
        'url query params are parsed and passed': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.deepEqual(req.query, {
                foo: 'bar',
                baz: 'qux'
            });
        },
        'url path is passed': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.equal(req.path, '/hoge');
        },
        'a namespace for the current request is initialized': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert(res.locals instanceof Object);
        }
    }
});

suite.export(module);
