/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Licensed under the BSD License.
 * http://yuilibrary.com/license/
 */

var dedupe  = require('../utils').dedupe,
    yuiPath = require('../yui-path'),

    TRAILING_SLASHES_RE = /\/+$/,
    LEADING_SLASHES_RE  = /^\/+/,

    YUI_CDN_BASE = 'http://yui.yahooapis.com/';

module.exports = function (config) {

    config = config || {};

    // 1) If the application module's base url is unspecified, we assume that
    //    those modules should be retrieved from the same base url that
    //    core/gallery YUI modules are retrieved from.
    // 2) If a secure version of a base url is not specified, we assume that we
    //    should use the corresponding non-secure base url.
    var yuiBase         = config.yuiBase        || YUI_CDN_BASE,
        appBase         = config.appBase        || yuiBase,
        yuiBaseSecure   = config.yuiBaseSecure  || yuiBase,
        appBaseSecure   = config.appBaseSecure  || appBase;

    /**
    Transforms YUI module metadata into URLs.
    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function url (req, res, next) {
        var groups  = res.locals.groups,
            filter  = res.locals.filter,
            type    = res.locals.type,
            urls    = [],
            modules,
            version,
            group,
            name,
            path,
            base,
            i,
            j;

        for (i = 0; i < groups.length; i += 1) {
            group   = groups[i];
            version = group.version || '';
            name    = group.name || '';
            modules = dedupe(group.modules);

            // trim slashes
            if (version[0] === '/') {
                version = version.replace(LEADING_SLASHES_RE, '');
            }
            if (version[version.length - 1] === '/') {
                version = version.replace(TRAILING_SLASHES_RE, '');
            }

            if (name === 'core' || name === 'gallery') {
                base = req.secure ? yuiBaseSecure : yuiBase;

                // Since older YUI and Gallery builds require the 'build'
                // directory, we always include it for simplicity.
                version += '/build';
            } else {
                base = req.secure ? appBaseSecure : appBase;
            }

            // format shifter-buit groups using yui-path
            if (name === 'core' || name === 'shifter' || name === 'gallery') {
                for (j = 0; j < modules.length; j += 1) {
                    path = yuiPath.format(version, modules[j], filter, type);

                    if (path instanceof Error) {
                        path.status = 400;
                        next(path);
                        return;
                    }

                    urls.push(base + path);
                }
            } else {
                for (j = 0; j < modules.length; j += 1) {
                    path = (version ? version + '/' : '') + modules[j] + '.' + type;
                    urls.push(base + path);
                }
            }
        }

        res.locals.urls = urls;

        next();
    };
};
