var vows        = require('vows'),
    assert      = require('assert'),
    strategy    = require('../lib/pathogen-decoder'),
    suite       = vows.describe('pathogen-decoder');

suite.addBatch({
    'when decoding a hash module group with module names of length 1': {
        topic: function () {
            return strategy.decode('/nobi/shizu+1xabcde.debug.js');
        },
        'module group is decoded as expected': function (decoded) {
            var group   = decoded.groups[0],
                modules = group.modules;

            assert.strictEqual(decoded.filter, 'debug', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 1, 'unexpected number of groups');
            assert.strictEqual(group.name, 'hash', 'unexpected group name');
            assert.strictEqual(modules.length, 5, 'unexpected number of modules');
            assert.strictEqual(group.version, 'nobi/shizu', 'unexpected version');

            ['a', 'b', 'c', 'd', 'e'].forEach(function (name, index) {
                assert.strictEqual(modules[index], name, 'unexpected module name');
            });
        }
    }
});

suite.addBatch({
    'when decoding a hash module group with module names of length 3': {
        topic: function () {
            return strategy.decode('/nobi/dora+3xaaabbbcccdddeee.js');
        },
        'module group is decoded as expected': function (decoded) {
            var group   = decoded.groups[0],
                modules = group.modules;

            assert.strictEqual(decoded.filter, 'min', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 1, 'unexpected number of groups');
            assert.strictEqual(group.name, 'hash', 'unexpected group name');
            assert.strictEqual(modules.length, 5, 'unexpected number of modules');
            assert.strictEqual(group.version, 'nobi/dora', 'unexpected version');

            ['aaa', 'bbb', 'ccc', 'ddd', 'eee'].forEach(function (name, index) {
                assert.strictEqual(modules[index], name, 'unexpected module name');
            });
        }
    }
});

suite.addBatch({
    'when decoding two hash module groups with module name lengths of 2 and 4': {
        topic: function () {
            return strategy.decode('/nobi/dora+4xaaaabbbbccccddddeeee;nobi/shizu+2x44dd00.raw.js');
        },
        'module groups are decoded as expected': function (decoded) {
            var group,
                modules;

            assert.strictEqual(decoded.filter, 'raw', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 2, 'unexpected number of groups');

            group   = decoded.groups[0];
            modules = group.modules;

            assert.strictEqual(group.name, 'hash', 'unexpected group name');
            assert.strictEqual(modules.length, 5, 'unexpected number of modules');
            assert.strictEqual(group.version, 'nobi/dora', 'unexpected version');

            ['aaaa', 'bbbb', 'cccc', 'dddd', 'eeee'].forEach(function (name, index) {
                assert.strictEqual(modules[index], name, 'unexpected module name');
            });

            group   = decoded.groups[1];
            modules = group.modules;

            assert.strictEqual(group.name, 'hash', 'unexpected group name');
            assert.strictEqual(modules.length, 3, 'unexpected number of modules');
            assert.strictEqual(group.version, 'nobi/shizu', 'unexpected version');

            ['44', 'dd', '00'].forEach(function (name, index) {
                assert.strictEqual(modules[index], name, 'unexpected module name');
            });
        }
    }
});

suite.addBatch({
    'when decoding a hash module group with module names of length 0': {
        topic: function () {
            return strategy.decode('/0+nobi/dora+aaabbbcccdddeee.js');
        },
        'an error is returned': function (decoded) {
            assert(decoded instanceof Error, 'expected an error');
        }
    },
    'when decoding a hash module group with module names of negative length': {
        topic: function () {
            return strategy.decode('/-2+nobi/dora+aaabbbcccdddeee.js');
        },
        'an error is returned': function (decoded) {
            assert(decoded instanceof Error, 'expected an error');
        }
    }
});

suite.addBatch({
    'when decoding a core module group': {
        topic: function () {
            return strategy.decode('/core+3.14.0-rc-1+oop,node-base.debug.js');
        },
        'module group is decoded as expected': function (decoded) {
            var group = decoded.groups[0];

            assert.strictEqual(decoded.filter, 'debug', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 1, 'unexpected number of groups');
            assert.strictEqual(group.name, 'core', 'unexpected group name');
            assert.strictEqual(group.modules.length, 2, 'unexpected number of modules');
            assert.strictEqual(group.version, '3.14.0-rc-1', 'unexpected version');
        }
    }
});

suite.addBatch({
    'when decoding a gallery module group': {
        topic: function () {
            return strategy.decode('/gallery+2013.09.04-21-56+pathogen-encoder.js');
        },
        'module group is decoded as expected': function (decoded) {
            var group = decoded.groups[0];

            assert.strictEqual(decoded.filter, 'min', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 1, 'unexpected number of groups');
            assert.strictEqual(group.name, 'gallery', 'unexpected group name');
            assert.strictEqual(group.modules.length, 1, 'unexpected number of modules');
            assert.strictEqual(group.version, 'gallery-2013.09.04-21-56', 'unexpected version');
        }
    }
});

suite.addBatch({
    'when decoding a shifter module group': {
        topic: function () {
            return strategy.decode('/s+os/mit/td/ape-applet-0.0.35+ape-applet-templates-applet-remove,af-applet-removeview.js');
        },
        'module group is decoded as expected': function (decoded) {
            var group = decoded.groups[0];

            assert.strictEqual(decoded.filter, 'min', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 1, 'unexpected number of groups');
            assert.strictEqual(group.name, 'shifter', 'unexpected group name');
            assert.strictEqual(group.modules.length, 2, 'unexpected number of modules');
            assert.strictEqual(group.version, 'os/mit/td/ape-applet-0.0.35', 'unexpected version');
        }
    }
});

suite.addBatch({
    'when decoding a relative path module group': {
        topic: function () {
            return strategy.decode('/os/mit/td/ape-applet-0.0.35+ape-applet-templates-applet-remove,af-applet-removeview.js');
        },
        'module group is decoded as expected': function (decoded) {
            var group = decoded.groups[0];

            assert.strictEqual(decoded.filter, 'min', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 1, 'unexpected number of groups');
            assert.strictEqual(group.name, undefined, 'unexpected group name');
            assert.strictEqual(group.modules.length, 2, 'unexpected number of modules');
            assert.strictEqual(group.version, 'os/mit/td/ape-applet-0.0.35', 'unexpected version');
        }
    }
});

suite.addBatch({
    'when decoding a full path module group': {
        topic: function () {
            var path = [
                'os/mit/td/ape-applet-0.0.35',
                'os/mit/td/ape-applet-templates-applet-remove',
                'os/mit/td/af-applet-removeview'
            ].join(';');

            return strategy.decode('/' + path + '.js');
        },
        'module groups are decoded as expected': function (decoded) {
            assert.strictEqual(decoded.filter, 'min', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 3, 'unexpected number of groups');
            assert.strictEqual(decoded.groups[0].name, undefined, 'unexpected group name');
            assert.strictEqual(decoded.groups[0].modules.length, 1, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[0].version, undefined, 'unexpected version');
            assert.strictEqual(decoded.groups[1].name, undefined, 'unexpected group name');
            assert.strictEqual(decoded.groups[1].modules.length, 1, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[1].version, undefined, 'unexpected version');
            assert.strictEqual(decoded.groups[2].name, undefined, 'unexpected group name');
            assert.strictEqual(decoded.groups[2].modules.length, 1, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[2].version, undefined, 'unexpected version');
        }
    }
});

suite.addBatch({
    'when decoding a mixed module groups': {
        topic: function () {
            var path = [
                'core+3.15.0+oop,get',
                'gallery+2013.09.04-21-56+pathogen-encoder',
                'os/mit/td/ape-applet-0.0.35+kamen,rider,os',
                'kamen-rider/wizard',
                'kamen-rider/fourze',
                'kamen-rider-os'
            ].join(';');

            return strategy.decode('/' + path + '.js');
        },
        'module groups are decoded as expected': function (decoded) {
            assert.strictEqual(decoded.filter, 'min', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 6, 'unexpected number of groups');

            assert.strictEqual(decoded.groups[0].name, 'core', 'unexpected group name');
            assert.strictEqual(decoded.groups[0].modules.length, 2, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[0].version, '3.15.0', 'unexpected version');

            assert.strictEqual(decoded.groups[1].name, 'gallery', 'unexpected group name');
            assert.strictEqual(decoded.groups[1].modules.length, 1, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[1].version, 'gallery-2013.09.04-21-56', 'unexpected version');

            assert.strictEqual(decoded.groups[2].name, undefined, 'unexpected group name');
            assert.strictEqual(decoded.groups[2].modules.length, 3, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[2].version, 'os/mit/td/ape-applet-0.0.35', 'unexpected version');

            assert.strictEqual(decoded.groups[3].name, undefined, 'unexpected group name');
            assert.strictEqual(decoded.groups[3].modules.length, 1, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[3].version, undefined, 'unexpected version');

            assert.strictEqual(decoded.groups[4].name, undefined, 'unexpected group name');
            assert.strictEqual(decoded.groups[4].modules.length, 1, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[4].version, undefined, 'unexpected version');

            assert.strictEqual(decoded.groups[5].name, undefined, 'unexpected group name');
            assert.strictEqual(decoded.groups[5].modules.length, 1, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[5].version, undefined, 'unexpected version');
        }
    }
});

suite.addBatch({
    'when decoding module groups with short names': {
        topic: function () {
            var path = [
                'c+3.15.0+oop,get',
                'g+2013.09.04-21-56+pathogen-encoder',
                's+os/mit/td/ape-applet-0.0.35+kamen,rider,os'
            ].join(';');

            return strategy.decode('/' + path + '.debug.js');
        },
        'module group names should be expanded': function (decoded) {
            assert.strictEqual(decoded.filter, 'debug', 'unexpected filter');
            assert.strictEqual(decoded.type, 'js', 'unexpected type');
            assert.strictEqual(decoded.groups.length, 3, 'unexpected number of groups');

            assert.strictEqual(decoded.groups[0].name, 'core', 'unexpected group name');
            assert.strictEqual(decoded.groups[0].modules.length, 2, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[0].version, '3.15.0', 'unexpected version');

            assert.strictEqual(decoded.groups[1].name, 'gallery', 'unexpected group name');
            assert.strictEqual(decoded.groups[1].modules.length, 1, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[1].version, 'gallery-2013.09.04-21-56', 'unexpected version');

            assert.strictEqual(decoded.groups[2].name, 'shifter', 'unexpected group name');
            assert.strictEqual(decoded.groups[2].modules.length, 3, 'unexpected number of modules');
            assert.strictEqual(decoded.groups[2].version, 'os/mit/td/ape-applet-0.0.35', 'unexpected version');
        }
    }
});

suite.addBatch({
    'when decoding a js asset with an invalid filter': {
        topic: function () {
            return strategy.decode('/c+3.15.0+yui.foo.js');
        },
        'decoded filter should default to `min`': function (decoded) {
            assert.strictEqual(decoded.filter, 'min');
        }
    },
    'when decoding a path with a valid `min` filter': {
        topic: function () {
            return strategy.decode('/c+3.15.0+yui.min.js');
        },
        'decoded filter should be `min`': function (decoded) {
            assert.strictEqual(decoded.filter, 'min');
        }
    },
    'when decoding a path with a valid `raw` filter': {
        topic: function () {
            return strategy.decode('/c+3.15.0+yui.raw.js');
        },
        'decoded filter should be `raw`': function (decoded) {
            assert.strictEqual(decoded.filter, 'raw');
        }
    },
    'when decoding a path with a valid `debug` filter': {
        topic: function () {
            return strategy.decode('/c+3.15.0+yui.debug.js');
        },
        'decoded filter should be `debug`': function (decoded) {
            assert.strictEqual(decoded.filter, 'debug');
        }
    }
});

suite.addBatch({
    'when decoding a css asset with an invalid filter': {
        topic: function () {
            return strategy.decode('/c+3.15.0+yui.bar.css');
        },
        'decoded filter should default to `min`': function (decoded) {
            assert.strictEqual(decoded.filter, 'min');
        }
    },
    'when decoding a path with a valid `min` filter': {
        topic: function () {
            return strategy.decode('/c+3.15.0+yui.min.css');
        },
        'decoded filter should be `min`': function (decoded) {
            assert.strictEqual(decoded.filter, 'min');
        }
    },
    'when decoding a path with a valid `raw` filter': {
        topic: function () {
            return strategy.decode('/c+3.15.0+yui.raw.css');
        },
        'decoded filter should be `raw`': function (decoded) {
            assert.strictEqual(decoded.filter, 'raw');
        }
    }
});

suite.addBatch({
    'when a module group has too many subgroups': {
        topic: function () {
            return strategy.decode('/c+3.15.0+yui+oops.css');
        },
        'an error should be returned': function (decoded) {
            assert(decoded instanceof Error);
        }
    },
    'when an invalid module group name is encountered': {
        topic: function () {
            return strategy.decode('/ny+jamaica/queens+ps131,jhs216,bronxscience.js');
        },
        'an error should be returned': function (decoded) {
            assert(decoded instanceof Error);
        }
    }
});

suite.export(module);
