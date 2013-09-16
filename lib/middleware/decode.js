module.exports = function (config) {
    config = config || {};

    var strategy = config.strategy;

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
