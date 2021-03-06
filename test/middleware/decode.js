var vows    = require('vows');
var assert  = require('assert');
var suite   = vows.describe('middleware-decode');
var next    = function () {};
var mid     = require('../../lib/middleware/decode');

function generateMock () {
    return {
        req: {},
        res: {
            locals: {}
        }
    };
}

var strategy = {
    decode: function (path, query) {
        return {
            groups: [path, query, 'groups'].join('+'),
            type:   [path, query, 'type'].join('+'),
            filter: [path, query, 'filter'].join('+')
        };
    }
};

suite.addBatch({
    'when passed the path and query params of a url': {
        topic: function () {
            var mock = generateMock();
            mock.req.path = 'path';
            mock.req.query = 'query';

            return {
                middleware: mid({ strategy: strategy }),
                mock: mock
            };
        },
        'the groups are decoded': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.equal(
                res.locals.groups,
                [req.path, req.query, 'groups'].join('+')
            );
        },
        'the type is decoded': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.equal(
                res.locals.type,
                [req.path, req.query, 'type'].join('+')
            );
        },
        'the filter is decoded': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res;

            middleware(req, res, next);
            assert.equal(
                res.locals.filter,
                [req.path, req.query, 'filter'].join('+')
            );
        }
    }
});

suite.export(module);
