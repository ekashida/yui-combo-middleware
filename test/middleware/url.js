var vows    = require('vows');
var assert  = require('assert');
var mockery = require('mockery');
var suite   = vows.describe('middleware-url');
var next    = function () {};

mockery.registerMock('../dedupe', function (things) {
    return things;
});

mockery.registerMock('../url-yui', function () {
    return function (mods) {
        var out = [];

        if (!mods) {
            return new Error();
        }

        mods.forEach(function (mod) {
            out.push('http://example.com/' + mod);
        });

        return out;
    };
});

mockery.enable({ useCleanCache: true });
mockery.registerAllowable('../../lib/middleware/url', true);
var mid = require('../../lib/middleware/url');
mockery.disable();

function generateMocks () {
    return {
        req: {},
        res: {
            locals: {}
        }
    };
}

suite.addBatch({
    'given an array of valid module metadata': {
        topic: function () {
            var mock = generateMocks();

            mock.res.locals.groups = [
                {
                    modules: ['foo', 'bar'],
                    name: 'core'
                },
                {
                    modules: ['baz', 'bif'],
                    name: 'gallery'
                },
                {
                    modules: ['tora', 'maru'],
                    name: 'app'
                }
            ];

            return {
                middleware: mid({}),
                mock: mock
            };
        },
        'all modules are passed through a formatter': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);

            assert.equal(res.locals.urls.length, 6);
            assert.deepEqual(res.locals.urls, [
                'http://example.com/foo',
                'http://example.com/bar',
                'http://example.com/baz',
                'http://example.com/bif',
                'http://example.com/tora',
                'http://example.com/maru'
            ]);
        }
    },
    'given an array that includes invalid module metadata': {
        topic: function () {
            var mock = generateMocks();

            mock.res.locals.groups = [
                {
                    modules: ['foo', 'bar'],
                    name: 'invalid!'
                },
                {
                    modules: ['tora', 'maru'],
                    name: 'app'
                }
            ];

            return {
                middleware: mid({}),
                mock: mock
            };
        },
        'an error should be passed to next()': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, function (err) {
                assert(err instanceof Error);
            });
        }
    }
});

suite.export(module);
