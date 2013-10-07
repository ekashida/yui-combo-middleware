var vows    = require('vows'),
    assert  = require('assert'),
    yuiPath = require('../lib/yui-path'),
    suite   = vows.describe('yui-path');

suite.addBatch({
    'given an invalid filter': {
        topic: function () {
            return yuiPath.format('3.12.0', 'shishi', 'tora', 'js');
        },
        'the filter defaults to min': function (path) {
            assert.equal(path, '3.12.0/shishi/shishi-min.js');
        }
    },
    'given a min filter': {
        topic: function () {
            return yuiPath.format('3.12.0', 'foo-bar', 'min', 'js');
        },
        'the min filter is applied': function (path) {
            assert.equal(path, '3.12.0/foo-bar/foo-bar-min.js');
        }
    },
    'given a raw filter': {
        topic: function () {
            return yuiPath.format('3.12.0', 'yui', 'raw', 'js');
        },
        'the raw filter is applied': function (path) {
            assert.equal(path, '3.12.0/yui/yui.js');
        }
    },
    'given a debug filter': {
        topic: function () {
            return yuiPath.format('3.12.0', 'foo-bar', 'debug', 'js');
        },
        'the debug filter is applied': function (path) {
            assert.equal(path, '3.12.0/foo-bar/foo-bar-debug.js');
        }
    },
    'given path components of a skin module': {
        topic: function () {
            return [
                yuiPath.format('3.12.0', 'skin-sam-bar-baz', 'min', 'css'),
                yuiPath.format('3.12.0', 'skin-sam-hoge_piyo', 'min', 'css'),
                yuiPath.format('3.12.0', 'skin-sam-hoge--hoge', 'min', 'css')
            ];
        },
        'the paths are formatted as expected': function (paths) {
            assert.deepEqual(paths, [
                '3.12.0/bar-baz/assets/skins/sam/bar-baz.css',
                '3.12.0/hoge_piyo/assets/skins/sam/hoge_piyo.css',
                '3.12.0/hoge--hoge/assets/skins/sam/hoge--hoge.css',
            ]);
        }
    },
    'given an invalid file type': {
        topic: function () {
            return yuiPath.format('3.12.0', 'foo', 'debug', 'html');
        },
        'an error is returned': function (path) {
            assert(path instanceof Error);
        }
    },
    'given path components of a lang pack': {
        topic: function () {
            return [
                yuiPath.format('3.12.0', 'lang/foo_sr-Latn-RS', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/foo_es-419', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/foo_de-CH-1996', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/foo_i-klingon', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/foo_x-fr-CH', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/foo_sgn-BE-FR', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/autocomplete-list', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/baz-bif_en', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/piyo-hoge-fuga_ja-JP', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/has_underscore_in_name_es', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/has_underscore_in_name', 'min', 'js'),
                yuiPath.format('3.12.0', 'lang/ni-hao_zh-Hans-CN', 'min', 'js')
            ];
        },
        'the paths are formatted as expected': function (paths) {
            assert.deepEqual(paths, [
                '3.12.0/foo/lang/foo_sr-Latn-RS.js',
                '3.12.0/foo/lang/foo_es-419.js',
                '3.12.0/foo/lang/foo_de-CH-1996.js',
                '3.12.0/foo/lang/foo_i-klingon.js',
                '3.12.0/foo/lang/foo_x-fr-CH.js',
                '3.12.0/foo/lang/foo_sgn-BE-FR.js',
                '3.12.0/autocomplete-list/lang/autocomplete-list.js',
                '3.12.0/baz-bif/lang/baz-bif_en.js',
                '3.12.0/piyo-hoge-fuga/lang/piyo-hoge-fuga_ja-JP.js',
                '3.12.0/has_underscore_in_name/lang/has_underscore_in_name_es.js',
                '3.12.0/has_underscore_in_name/lang/has_underscore_in_name.js',
                '3.12.0/ni-hao/lang/ni-hao_zh-Hans-CN.js'
            ]);
        }
    },
    'when missing a path component': {
        topic: function () {
            return [
                yuiPath.format(undefined, 'foo-bar', 'min', 'js'),
                yuiPath.format('3.12.0', undefined, 'min', 'js'),
                yuiPath.format('3.12.0', 'foo-bar', undefined, 'js'),
                yuiPath.format('3.12.0', 'foo-bar', 'min', undefined)
            ];
        },
        'an error is returned': function (paths) {
            paths.forEach(function (path) {
                assert(path instanceof Error);
            });
        }
    }
});

suite.export(module);
