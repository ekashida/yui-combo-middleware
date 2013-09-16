var vows    = require('vows');
var assert  = require('assert');
var mockery = require('mockery');
var suite   = vows.describe('middleware-esi');
var next    = function () {};

mockery.registerMock('handlebars', {
    compile: function () {
        return function (o) {
            return o.urls;
        };
    }
});

mockery.registerMock('path', {
    join: function () {}
});

mockery.registerMock('fs', {
    existsSync: function () {
        return true;
    },
    readFileSync: function () {}
});

mockery.enable({ useCleanCache: true });
mockery.registerAllowable('../../lib/middleware/esi', true);
var mid = require('../../lib/middleware/esi');
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
    'given an array of urls': {
        topic: function () {
            var mock = generateMocks();

            return {
                middleware: mid(),
                mock: mock
            };
        },
        'they are rendered as a template and passed as the body': function (o) {
            var middleware = o.middleware,
                req = o.mock.req,
                res = o.mock.res,
                urls = 'a list of urls';

            res.locals.urls = urls;

            middleware(req, res, next);
            assert.equal(res.locals.body, urls);
        }
    }
});

suite.export(module);
