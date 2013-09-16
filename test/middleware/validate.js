var vows    = require('vows');
var assert  = require('assert');
var suite   = vows.describe('middleware-validate');

var mid = require('../../lib/middleware/validate');

function generateMocks () {
    return {
        req: {},
        res: {
            locals: {}
        }
    };
}

suite.addBatch({
    'given a secure request without gallery modules': {
        topic: function () {
            var mock = generateMocks();

            mock.req.comboSecure = true;

            mock.res.locals.groups = [
                {
                    modules: ['foo', 'bar'],
                    name: 'core',
                    version: '3.12.0'
                },
                {
                    modules: ['tora', 'maru'],
                    name: 'app',
                    version: 'some/root'
                }
            ];

            return {
                middleware: mid(),
                mock: mock
            };
        },
        'the validator should not pass an error': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, function (err) {
                assert(err === undefined);
            });
        }
    },
    'given a secure request with gallery modules': {
        topic: function () {
            var mock = generateMocks();

            mock.req.comboSecure = true;

            mock.res.locals.groups = [
                {
                    modules: ['foo', 'bar'],
                    name: 'core',
                    version: '3.12.0'
                },
                {
                    modules: ['tora', 'maru'],
                    name: 'gallery',
                    version: 'gallery-2013.08.07-20-34'
                }
            ];

            return {
                middleware: mid(),
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
    },
    'given a request with an invalid yui version': {
        topic: function () {
            var mock = generateMocks();

            mock.res.locals.groups = [{
                modules: ['foo', 'bar'],
                name: 'core',
                version: '4.0.0'
            }];

            return {
                middleware: mid(),
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
    },
    'given a request with an invalid gallery version': {
        topic: function () {
            var mock = generateMocks();

            mock.res.locals.groups = [{
                modules: ['foo', 'bar'],
                name: 'gallery',
                version: 'invalid-version'
            }];

            return {
                middleware: mid(),
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
