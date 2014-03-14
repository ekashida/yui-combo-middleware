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
    return function validate (req, res, next) {
        var groups = res.locals.groups,
            modules,
            version,
            group,
            name,
            err,
            len,
            i;

        for (i = 0, len = groups.length; i < len; i += 1) {
            group   = groups[i];
            name    = group.name;
            modules = group.modules;
            version = group.version;

            if (name === 'core') {
                if (!YUI_VERSION_RE.test(version)) {
                    err = new Error('Invalid core version ' + version);
                    err.status = 400;
                    return next(err);
                }
            } else if (name === 'gallery') {
                if (!GALLERY_VERSION_RE.test(version)) {
                    err = new Error('Invalid gallery version ' + version);
                    err.status = 400;
                    return next(err);
                }

                if (req.secure) {
                    err = new Error('Cannot serve gallery modules over https');
                    err.status = 400;
                    return next(err);
                }
            }

            if (!modules.length) {
                err = new Error('No modules requested');
                err.status = 400;
                return next(err);
            }
        }

        next();
    };
};
