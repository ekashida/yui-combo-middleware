/*
 * Copyright 2014 Yahoo! Inc. All rights reserved.
 * Licensed under the BSD License.
 * http://yuilibrary.com/license/
 */

var GROUP_DELIMITER     = ';',
    MODULE_DELIMITER    = ',',
    GROUP_SUB_DELIMITER = '+',
    DEFAULT_FILTER      = 'min',
    GALLERY_PREFIX      = 'gallery-',
    HASH_PREFIX_RE      = /^\d+x/,

    VALIDATOR = {
        js: {
            raw: true,
            min: true,
            debug: true
        },
        css: {
            raw: true,
            min: true
        }
    },

    EXPANDED_GROUP_NAMES = [
        'core',
        'shifter',
        'gallery'
    ];

/**
 * Decoder for groups that don't require additional processing
 * @method simpleDecoder
 * @param {Array} parts Subgroups of simple module groups
 * @return {Object} Decoded module group
 */
function simpleDecoder (parts) {
    return {
        name:       parts[0],
        version:    parts[1],
        modules:    parts[2].split(MODULE_DELIMITER)
    };
}

/**
 * Decoder for the gallery module group
 * @method galleryDecoder
 * @param {Array} parts Subgroup of the gallery module group
 * @return {Object} Decoded module group
 */
function galleryDecoder (parts) {
    var version = parts[1],
        modules = parts[2],
        len,
        i;

    // 2013.06.20-02-07 => gallery-2013.06.20-02-07
    version = GALLERY_PREFIX + version;

    modules = modules.split(MODULE_DELIMITER);
    for (i = 0, len = modules.length; i < len; i += 1) {
        // bitly => gallery-bitly
        modules[i] = GALLERY_PREFIX + modules[i];
    }

    return {
        name:       parts[0],
        version:    version,
        modules:    modules
    };
}

/**
 * Decoder for the hash module group
 * @method hashDecoder
 * @param {Array} parts Subgroups of the hash module group
 * @return {Object} Decoded module group
 */
function hashDecoder (parts) {
    var hashParts   = parts[1].split('x'),
        length      = +(hashParts[0]),
        hash        = hashParts[1],
        modules     = [],
        index       = 0;

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
        version:    parts[0],
        modules:    modules
    };
}

exports.decodeGroup = function (group) {
    var parts   = group.split(GROUP_SUB_DELIMITER),
        decoded,
        expanded,
        name;

    // [ group name, group version, module names ]
    if (parts.length === 3) {
        name = parts[0];

        // expand any short group names ('c' for 'core', etc)
        EXPANDED_GROUP_NAMES.some(function (groupName) {
            if (groupName.indexOf(name) === 0) {
                expanded = groupName;
                return true;
            }
        });

        if (expanded) {
            parts[0] = expanded; // e.g., 'g' => 'gallery'

            if (expanded === 'gallery') {
                decoded = galleryDecoder(parts);
            } else {
                decoded = simpleDecoder(parts);
            }
        } else {
            decoded = new Error('Unrecognized module group name ' + name);
        }
    }
    // [ group version (root path), module names (relative paths) ]
    else if (parts.length === 2) {
        if (HASH_PREFIX_RE.test(parts[1])) {
            decoded = hashDecoder(parts);
        } else {
            decoded = {
                version: parts[0],
                modules: parts[1].split(MODULE_DELIMITER)
            };
        }
    }
    // [ module name (absolute path) ]
    else if (parts.length === 1) {
        decoded = {
            modules: parts
        };
    }
    else {
        decoded = new Error('Module group contains an unexpected number of subgroups: ' + group);
    }

    return decoded;
};

exports.decode = function (path) {
    // '/a;b;c' => 'a;b;c' => ['a', 'b', 'c']
    var groups = path.slice(1).split(GROUP_DELIMITER),
        decodedGroups = [],
        decoded,
        filter,
        parts,
        type,
        len,
        i;

    // The last group contains filter (optional) and type (required) metadata.
    parts = groups[groups.length - 1].split('.');

    // We require the file type extension (.js or .css) because some IE
    // versions use the extension to determine the content type:
    // http://msdn.microsoft.com/en-us/library/ms775148(v=vs.85).asp
    type = parts.pop();
    if (!VALIDATOR[type]) {
        return new Error('Invalid extension: ' + type);
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
            return decoded;
        }

        decodedGroups.push(decoded);
    }

    return {
        groups: decodedGroups,
        filter: filter,
        type:   type
    };
};
