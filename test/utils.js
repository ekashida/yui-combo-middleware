var vows    = require('vows');
var assert  = require('assert');
var dedupe  = require('../lib/utils').dedupe;
var suite   = vows.describe('utils');

suite.addBatch({
    'when deduping an array of strings': {
        topic: function () {
            return dedupe(['hello', 'hello', 'world', 'world', 'hello']);
        },
        'we get back an array with unique values': function (deduped) {
            assert.lengthOf(deduped, 2);
            assert.deepEqual(deduped, ['hello', 'world']);
        }
    },
    'when deduping an empty array': {
        topic: function () {
            return dedupe([]);
        },
        'we get back an empty array': function (deduped) {
            assert.lengthOf(deduped, 0);
        }
    },
    'when deduping an array that contains empty strings': {
        topic: function () {
            return dedupe(['', 'foo', '', 'foo', 'bar']);
        },
        'the empty strings are discarded': function (deduped) {
            assert.lengthOf(deduped, 2);
            assert.deepEqual(deduped, ['foo', 'bar']);
        }
    },
    'when deduping an array that contains only empty strings': {
        topic: function () {
            return dedupe(['', '', '']);
        },
        'the empty strings are discarded': function (deduped) {
            assert.lengthOf(deduped, 0);
            assert.deepEqual(deduped, []);
        }
    }
});

suite.export(module);
