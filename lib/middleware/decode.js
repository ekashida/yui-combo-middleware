module.exports = function (config) {
    config = config || {};

    var strategy = config.strategy;

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
        strategy.decode({
            path: req.path,
            query: req.query
        }, function (err, decoded) {
            if (err) {
                res.statusCode = 400;
                return next(err);
            }

            res.locals.groups = decoded.groups;
            res.locals.type   = decoded.type;
            res.locals.filter = decoded.filter;

            next();
        });
    };
};
