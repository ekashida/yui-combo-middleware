var vows    = require('vows');
var assert  = require('assert');
var urlYui  = require('../lib/url-yui');
var suite   = vows.describe('url-yui');

suite.addBatch({
    'when formatting js urls': {
        topic: function () {
            var format = urlYui({
                host: 'yui.yahooapis.com'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                type: 'js',
                version: '3.10.3'
            });
        },
        'we get an array of js cdn urls': function (urls) {
            assert.deepEqual(urls, [
                'http://yui.yahooapis.com/3.10.3/foo/foo-min.js',
                'http://yui.yahooapis.com/3.10.3/bar/bar-min.js',
                'http://yui.yahooapis.com/3.10.3/baz/baz-min.js'
            ]);
        }
    },
    'when formatting css urls': {
        topic: function () {
            var format = urlYui({
                host: 'yui.yahooapis.com'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                type: 'css',
                version: '3.10.3'
            });
        },
        'we get an array of css cdn urls': function (urls) {
            assert.deepEqual(urls, [
                'http://yui.yahooapis.com/3.10.3/foo/foo-min.css',
                'http://yui.yahooapis.com/3.10.3/bar/bar-min.css',
                'http://yui.yahooapis.com/3.10.3/baz/baz-min.css'
            ]);
        }
    },
    'when formatting urls without specifying a version': {
        topic: function () {
            var format = urlYui({
                host: 'yui.yahooapis.com'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                type: 'js'
            });
        },
        'we get an error': function (urls) {
            assert(urls instanceof Error);
        }
    },
    'when formatting urls without specifying a file type': {
        topic: function () {
            return urlYui.format([
                'foo', 'bar', 'baz'
            ], {
                version: '3.10.3'
            });
        },
        'we get an error': function (urls) {
            assert(urls instanceof Error);
        }
    },
    'when formatting urls with the raw format': {
        topic: function () {
            var format = urlYui({
                host: 'yui.yahooapis.com'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                version: '3.10.3',
                type: 'js',
                filter: 'raw'
            });
        },
        'we get raw files': function (urls) {
            assert.deepEqual(urls, [
                'http://yui.yahooapis.com/3.10.3/foo/foo.js',
                'http://yui.yahooapis.com/3.10.3/bar/bar.js',
                'http://yui.yahooapis.com/3.10.3/baz/baz.js'
            ]);
        }
    },
    'when formatting urls with the debug format': {
        topic: function () {
            var format = urlYui({
                host: 'yui.yahooapis.com'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                version: '3.10.3',
                type: 'js',
                filter: 'debug'
            });
        },
        'we get debug files': function (urls) {
            assert.deepEqual(urls, [
                'http://yui.yahooapis.com/3.10.3/foo/foo-debug.js',
                'http://yui.yahooapis.com/3.10.3/bar/bar-debug.js',
                'http://yui.yahooapis.com/3.10.3/baz/baz-debug.js'
            ]);
        }
    },
    'when formatting urls with an unrecognized format': {
        topic: function () {
            var format = urlYui({
                host: 'yui.yahooapis.com'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                version: '3.10.3',
                type: 'js',
                filter: 'bif'
            });
        },
        'we default to min': function (urls) {
            assert.deepEqual(urls, [
                'http://yui.yahooapis.com/3.10.3/foo/foo-min.js',
                'http://yui.yahooapis.com/3.10.3/bar/bar-min.js',
                'http://yui.yahooapis.com/3.10.3/baz/baz-min.js'
            ]);
        }
    },
    'when formatting urls with skin modules': {
        topic: function () {
            var format = urlYui({
                host: 'l.yimg.com'
            });

            return format([
                'skin-toranosuke-foo', 'skin-shishimaru-bar', 'baz'
            ], {
                version: 'maybe-a-root',
                type: 'css'
            });
        },
        'we correctly format skin and core modules': function (urls) {
            assert.deepEqual(urls, [
                'http://l.yimg.com/maybe-a-root/foo/assets/skins/toranosuke/foo.css',
                'http://l.yimg.com/maybe-a-root/bar/assets/skins/shishimaru/bar.css',
                'http://l.yimg.com/maybe-a-root/baz/baz-min.css'
            ]);
        }
    },
    'when formatting urls with lang modules': {
        topic: function () {
            var format = urlYui({
                host: 'l.yimg.com'
            });

            return format([
                'lang/toranosuke-foo_ja', 'lang/shishimaru_ja-JP', 'baz'
            ], {
                version: 'maybe-a-root',
                filter: 'debug',
                type: 'js'
            });
        },
        'we correctly format lang and core modules': function (urls) {
            assert.deepEqual(urls, [
                'http://l.yimg.com/maybe-a-root/toranosuke-foo/lang/toranosuke-foo_ja.js',
                'http://l.yimg.com/maybe-a-root/shishimaru/lang/shishimaru_ja-JP.js',
                'http://l.yimg.com/maybe-a-root/baz/baz-debug.js'
            ]);
        }
    },
    'when specifying a build directory': {
        topic: function () {
            var format = urlYui({
                host: 'l.yimg.com',
                buildDir: '/build_me'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                version: '3.10.3',
                type: 'js'
            });
        },
        'we use the specified build dir in the url': function (urls) {
            assert.deepEqual(urls, [
                'http://l.yimg.com/3.10.3/build_me/foo/foo-min.js',
                'http://l.yimg.com/3.10.3/build_me/bar/bar-min.js',
                'http://l.yimg.com/3.10.3/build_me/baz/baz-min.js'
            ]);
        }
    },
    'when formatting urls in a secure context without a secure host': {
        topic: function () {
            var format = urlYui({
                host: 'non-secure.com'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                version: '3.10.3',
                type: 'js',
                secure: true
            });
        },
        'we default to the non-secure host': function (urls) {
            assert.deepEqual(urls, [
                'http://non-secure.com/3.10.3/foo/foo-min.js',
                'http://non-secure.com/3.10.3/bar/bar-min.js',
                'http://non-secure.com/3.10.3/baz/baz-min.js'
            ]);
        }
    },
    'when formatting urls in a secure context with a secure host': {
        topic: function () {
            var format = urlYui({
                host: 'non-secure.com',
                secureHost: 'secure.com'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                version: '3.10.3',
                type: 'js',
                secure: true
            });
        },
        'we use the secure host': function (urls) {
            assert.deepEqual(urls, [
                'https://secure.com/3.10.3/foo/foo-min.js',
                'https://secure.com/3.10.3/bar/bar-min.js',
                'https://secure.com/3.10.3/baz/baz-min.js'
            ]);
        }
    },
    'when formatting urls in a non-secure context with a secure host': {
        topic: function () {
            var format = urlYui({
                host: 'non-secure.com',
                secureHost: 'secure.com'
            });

            return format([
                'foo', 'bar', 'baz'
            ], {
                version: '3.10.3',
                type: 'js'
            });
        },
        'we use the non-secure host': function (urls) {
            assert.deepEqual(urls, [
                'http://non-secure.com/3.10.3/foo/foo-min.js',
                'http://non-secure.com/3.10.3/bar/bar-min.js',
                'http://non-secure.com/3.10.3/baz/baz-min.js'
            ]);
        }
    }
});

suite.export(module);
