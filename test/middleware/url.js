var vows    = require('vows');
var assert  = require('assert');
var mockery = require('mockery');
var suite   = vows.describe('middleware-url');

var next = function () {},
    req,
    res;

mockery.registerMock('../utils', {
    dedupe: function (arr) { return arr; }
});

mockery.registerMock('../yui-path', {
    format: function () {
        if (arguments[1] === 'fail') {
            return new Error();
        } else {
            return Array.prototype.slice.apply(arguments).join('/');
        }
    }
});

mockery.enable({ useCleanCache: true });
mockery.registerAllowable('url', true);
mockery.registerAllowable('../../lib/middleware/url', true);
var mid = require('../../lib/middleware/url');
mockery.disable();

suite.addBatch({
    'given a middleware with default configuration': {
        topic: function () {
            return mid();
        },
        '(non-secure) the base defaults to the yui cdn base': function (middleware) {
            req = {};
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        name: 'core',
                        version: '3.12.0',
                        modules: ['hoge', 'piyo']
                    }]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 2);
            assert.deepEqual(res.locals.urls, [
                'http://yui.yahooapis.com/3.12.0/build/hoge/filter/type',
                'http://yui.yahooapis.com/3.12.0/build/piyo/filter/type'
            ]);
        },
        'an error is passed if the path formatter fails': function (middleware) {
            req = {};
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        name: 'core',
                        version: '3.12.0',
                        modules: ['fail'] // simulate a failure
                    }]
                }
            };

            middleware(req, res, function (err) {
                assert(err instanceof Error);
            });
        }
    },
    'given a middleware configured with a `yuiBase` that is not the default': {
        topic: function () {
            return mid({
                yuiBase: 'http://yuibase.com/'
            });
        },
        '(non-secure) the base is set to the value of `yuiBase`': function (middleware) {
            req = {};
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        name: 'core',
                        version: '3.12.0',
                        modules: ['hoge', 'piyo']
                    }]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 2);
            assert.deepEqual(res.locals.urls, [
                'http://yuibase.com/3.12.0/build/hoge/filter/type',
                'http://yuibase.com/3.12.0/build/piyo/filter/type'
            ]);
        },
        '(secure) the base is set to the value of `yuiBase`': function (middleware) {
            req = { secure: true };
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        name: 'core',
                        version: '3.12.0',
                        modules: ['hoge', 'piyo']
                    }]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 2);
            assert.deepEqual(res.locals.urls, [
                'http://yuibase.com/3.12.0/build/hoge/filter/type',
                'http://yuibase.com/3.12.0/build/piyo/filter/type'
            ]);
        }
    },
    'given a middleware configured with a secure base': {
        topic: function () {
            return mid({
                yuiBase: 'http://yuibase.com/',
                yuiBaseSecure: 'https://yuibasesecure.com/'
            });
        },
        '(non-secure) the base is set to the value of `yuiBase`': function (middleware) {
            req = {};
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        name: 'core',
                        version: '3.12.0',
                        modules: ['hoge', 'piyo']
                    }]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 2);
            assert.deepEqual(res.locals.urls, [
                'http://yuibase.com/3.12.0/build/hoge/filter/type',
                'http://yuibase.com/3.12.0/build/piyo/filter/type'
            ]);
        },
        '(secure) the base is set to the value of `yuiBaseSecure`': function (middleware) {
            req = { secure: true };
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        name: 'core',
                        version: '3.12.0',
                        modules: ['hoge', 'piyo']
                    }]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 2);
            assert.deepEqual(res.locals.urls, [
                'https://yuibasesecure.com/3.12.0/build/hoge/filter/type',
                'https://yuibasesecure.com/3.12.0/build/piyo/filter/type'
            ]);
        }
    },
    'given a middleware configured with just an `appBase`': {
        topic: function () {
            return mid({
                appBase: 'http://appbase.com/'
            });
        },
        '(non-secure) the base is set to the value of `appBase`': function (middleware) {
            req = {};
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        version: 'foo-bar',
                        modules: ['baz']
                    }]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 1, 'unexpected number of urls');
            assert.strictEqual(res.locals.urls[0], 'http://appbase.com/foo-bar/baz.type');
        },
        '(secure) the base is set to the value of `appBase`': function (middleware) {
            req = { secure: true };
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        name: 'root',
                        version: 'foo-bar',
                        modules: ['baz']
                    }]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 1);
            assert.strictEqual(res.locals.urls[0], 'http://appbase.com/foo-bar/baz.type');
        }
    },
    'given a middleware configured with both `appBase` and `appBaseSecure`': {
        topic: function () {
            return mid({
                appBase: 'http://appbase.com/',
                appBaseSecure: 'https://appbasesecure.com/'
            });
        },
        '(non-secure) the base is set to the value of `appBase`': function (middleware) {
            req = {};
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        version: '4.0.0',
                        modules: ['hoge', 'piyo']
                    }]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 2);
            assert.deepEqual(res.locals.urls, [
                'http://appbase.com/4.0.0/hoge.type',
                'http://appbase.com/4.0.0/piyo.type'
            ]);
        },
        '(secure) the base is set to the value of `appBaseSecure`': function (middleware) {
            req = { secure: true };
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [{
                        version: '3.12.0',
                        modules: ['hoge', 'piyo']
                    }]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 2);
            assert.deepEqual(res.locals.urls, [
                'https://appbasesecure.com/3.12.0/hoge.type',
                'https://appbasesecure.com/3.12.0/piyo.type'
            ]);
        }
    },
    'given a middleware configured with both `appBase` and `yuiBase`': {
        topic: function () {
            return mid({
                appBase: 'http://appbase.com/',
                yuiBase: 'https://yuibase.com/'
            });
        },
        'path module groups are decoded as expected': function (middleware) {
            req = {};
            res = {
                locals: {
                    filter: 'filter',
                    type: 'type',
                    groups: [
                        {
                            version: 'kamen/rider',
                            modules: ['wizard-min', 'fourze', 'w-debug', 'o-s']
                        }
                    ]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 4);
            assert.deepEqual(res.locals.urls, [
                'http://appbase.com/kamen/rider/wizard-min.type',
                'http://appbase.com/kamen/rider/fourze.type',
                'http://appbase.com/kamen/rider/w-debug.type',
                'http://appbase.com/kamen/rider/o-s.type'
            ]);
        },
        'absolute path module groups are decoded as expected': function (middleware) {
            req = {};
            res = {
                locals: {
                    type: 'type',
                    groups: [
                        {
                            modules: ['kamen/rider/wizard-min']
                        },
                        {
                            modules: ['kamen/rider/fourze']
                        },
                        {
                            modules: ['kamen/rider/w-debug']
                        },
                        {
                            modules: ['kamen/rider/o-s']
                        }
                    ]
                }
            };

            middleware(req, res, next);

            assert.strictEqual(res.locals.urls.length, 4);
            assert.deepEqual(res.locals.urls, [
                'http://appbase.com/kamen/rider/wizard-min.type',
                'http://appbase.com/kamen/rider/fourze.type',
                'http://appbase.com/kamen/rider/w-debug.type',
                'http://appbase.com/kamen/rider/o-s.type'
            ]);
        }
    }
});

suite.export(module);
