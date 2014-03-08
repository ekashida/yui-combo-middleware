/*
 * Copyright 2014 Yahoo! Inc. All rights reserved.
 * Licensed under the BSD License.
 * http://yuilibrary.com/license/
 */

var NAMESPACE           = 'p';
var GROUP_DELIMITER     = ';';
var MODULE_DELIMITER    = ',';
var GROUP_SUB_DELIMITER = '+';
var DEFAULT_FILTER      = 'min';
var GALLERY_PREFIX      = 'gallery-';

var VALIDATOR = {
    js: {
        raw: true,
        min: true,
        debug: true
    },
    css: {
        raw: true,
        min: true
    }
};

var NOOP = function () {};

/**
 * Decoder for groups that don't require additional processing
 * @method simpleDecoder
 * @param {String} name Module group name
 * @param {String} version Module group version
 * @param {String[]} modules Module names
 * @return {Object} Decoded module group
 */
function simpleDecoder (name, version, modules) {
    return {
        name:       name,
        version:    version,
        modules:    modules.split(MODULE_DELIMITER)
    };
}

/**
 * Decoder for the gallery module group
 * @method galleryDecoder
 * @param {String} name Module group name
 * @param {String} version Gallery version (without `gallery-` prefix)
 * @param {String[]} modules Gallery module names (without `gallery-` prefix)
 * @return {Object} Decoded module group
 */
function galleryDecoder (name, version, modules) {
    var len,
        i;

    // 2013.06.20-02-07 => gallery-2013.06.20-02-07
    version = GALLERY_PREFIX + version;

    modules = modules.split(MODULE_DELIMITER);
    for (i = 0, len = modules.length; i < len; i += 1) {
        // bitly => gallery-bitly
        modules[i] = GALLERY_PREFIX + modules[i];
    }

    return {
        name:       'gallery',
        version:    version,
        modules:    modules
    };
}

/**
 * Decoder for the hash module group
 * @method hashDecoder
 * @param {String} length Length of individual hash
 * @param {String} version Module group version
 * @param {String[]} hash Module list hash
 * @return {Object} Decoded module group
 */
function hashDecoder (length, version, hash) {
    var modules = [],
        index   = 0;

    if (length < 1) {
        return new Error('Hash length must be at least 1');
    }

    if (hash.length % length) {
        return new Error('Module list hash has unexpected length');
    }

    while (index < hash.length) {
        modules.push(hash.substr(index, length));
        index += length;
    }

    return {
        name:       'hash',
        version:    version,
        modules:    modules
    };
}

var EXPANDED_GROUP_NAMES = [
    'core',
    'root',
    'gallery'
];

/**
 * This decoding strategy's name. Potentially used to route combo requests.
 * @method namespace
 * @return {String}
 */
exports.namespace = function () {
    return NAMESPACE;
};

exports.decodeGroup = function (group) {
    var parts   = group.split(GROUP_SUB_DELIMITER),
        decoder = simpleDecoder,
        expandedName,
        name;

    // [ group name, group version, module names ]
    if (parts.length === 3) {
        name = parts[0];

        // expand any short group names ('c' for 'core', etc)
        EXPANDED_GROUP_NAMES.some(function (groupName) {
            if (groupName.indexOf(name) === 0) {
                expandedName = groupName;
                return true;
            }
        });

        if (expandedName) {
            // replace short name with expanded name ('g' => 'gallery')
            parts[0] = expandedName;

            if (expandedName === 'gallery') {
                decoder = galleryDecoder;
            }
        } else if (!isNaN(+name)) {
            // replace string with number equivalent ('5' => 5)
            parts[0] = +name;
            decoder = hashDecoder;
        } else {
            return new Error('Unrecognized module group ' + name);
        }
    }
    // [ root path, relative paths ]
    else if (parts.length === 2) {
        parts.unshift('root');
    }
    // XXX: For backwards compatibility. Remove after everyone moves off of
    // gallery-2013.10.09-22-56.
    //
    // Application modules with paths that were not compressed are simply
    // represented as a group containing a single path.
    else if (parts.length === 1) {
        parts = ['path', '', parts[0]];
    } else {
        decoder = NOOP;
    }

    return decoder.apply(null, parts) ||
        new Error('Module group has unexpected format');
};

exports.decode = function (url, callback) {
    // '/a;b;c' => 'a;b;c' => ['a', 'b', 'c']
    var groups = url.path.slice(1).split(GROUP_DELIMITER),
        decodedGroups = [],
        decoded,
        filter,
        parts,
        type,
        len,
        i;

    // The last group contains filter (optional) and type (required) metadata.
    parts = groups[groups.length - 1].split('.');

    // We require the file type as a faux extension (.js or .css) because some
    // IE versions use the extension to determine the content type:
    // http://msdn.microsoft.com/en-us/library/ms775148(v=vs.85).asp
    type = parts.pop();
    if (!VALIDATOR[type]) {
        return callback(new Error(
            'Encountered an invalid type while decoding: ' + type
        ));
    }

    // Determine the filter (i.e., min, debug, or raw).
    filter = parts[parts.length - 1];
    if (VALIDATOR[type][filter]) {
        // Optional filter was provided; remove it from the path parts.
        parts.pop();
    } else {
        // Optional filter was not provided; use default.
        filter = DEFAULT_FILTER;
    }

    // Replace last group after parsing out the filter and type metadata.
    groups[groups.length - 1] = parts.join('.');

    // Decode each encoded module group.
    for (i = 0, len = groups.length; i < len; i += 1) {
        decoded = exports.decodeGroup(groups[i]);

        if (decoded instanceof Error) {
            return callback(decoded);
        }

        decodedGroups.push(decoded);
    }

    callback(null, {
        groups: decodedGroups,
        filter: filter,
        type:   type
    });
};
