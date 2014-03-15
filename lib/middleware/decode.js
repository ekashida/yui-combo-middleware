/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Licensed under the BSD License.
 * http://yuilibrary.com/license/
 */

var pathogenStrategy = require('../pathogen-decoder');

module.exports = function decode (config) {
    config = config || {};

    var strategy = config.strategy || pathogenStrategy;

    /**
    Decode the request.

    Expects the path as `req.path` and the query as `req.query`.

    Returns decoded data:
      - `res.locals.groups` Array of groups.
      - `res.locals.type`   Combo asset type.
      - `res.locals.filter` Combo asset filter.

    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function (req, res, next) {
        var decoded = strategy.decode(req.path, req.query);

        if (decoded instanceof Error) {
            decoded.status = 400;
            next(decoded);
            return;
        }

        res.locals.groups = decoded.groups;
        res.locals.type   = decoded.type;
        res.locals.filter = decoded.filter;

        next();
    };
};
