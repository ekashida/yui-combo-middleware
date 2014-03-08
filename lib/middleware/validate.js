/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Licensed under the BSD License.
 * http://yuilibrary.com/license/
 */

var YUI_VERSION_RE      = /^\d+\.\d+\.\d+/;
var GALLERY_VERSION_RE  = /^gallery-\d{4}\.\d{2}\.\d{2}/;

module.exports = function (config) {
    config = config || {};

    /**
    Basic validation.

    - Core version
    - Gallery version
    - No gallery modules over secure connections
    - Empty module groups

    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function (req, res, next) {
        var groups = res.locals.groups,
            modules,
            version,
            group,
            name,
            len,
            i;

        // Validation errors here result from bad client requests. Set 400 by
        // default and set 200 when all validations pass.
        res.statusCode = 400;

        for (i = 0, len = groups.length; i < len; i += 1) {
            group   = groups[i];
            name    = group.name;
            modules = group.modules;
            version = group.version;

            if (name === 'core') {
                if (!YUI_VERSION_RE.test(version)) {
                    return next(
                        new Error('Invalid core version ' + version)
                    );
                }
            } else if (name === 'gallery') {
                if (!GALLERY_VERSION_RE.test(version)) {
                    return next(
                        new Error('Invalid gallery version ' + version)
                    );
                }

                if (req.comboSecure) {
                    return next(
                        new Error('Cannot serve gallery modules over secure connections')
                    );
                }
            }

            if (!modules.length) {
                return next(
                    new Error('No ' + name + ' modules requested')
                );
            }
        }

        res.statusCode = 200;
        next();
    };
};
