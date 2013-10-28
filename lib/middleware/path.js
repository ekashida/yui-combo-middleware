/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Licensed under the BSD License.
 * http://yuilibrary.com/license/
 */

var dedupe  = require('../utils').dedupe,
    yuiPath = require('../yui-path');

module.exports = function (config) {
    config = config || {};

    /**
    Transforms YUI module metadata into module paths.
    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function (req, res, next) {
        var groups  = res.locals.groups,
            paths   = [],
            modules,
            group,
            path;

/*jslint vars: true*/
        for (var i = 0; i < groups.length; i += 1) {
            group   = groups[i];
            modules = dedupe(group.modules);

            for (var j = 0; j < modules.length; j += 1) {
/*jslint vars: false*/
                path = yuiPath.format(
                    group.version,
                    modules[j],
                    res.locals.filter,
                    res.locals.type
                );

                if (path instanceof Error) {
                    res.statusCode = 400;
                    return next(path);
                }

                paths.push(path);
            }
        }

        res.locals.paths = paths;

        next();
    };
};
