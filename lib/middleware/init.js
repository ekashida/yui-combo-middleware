var lib = {
    url: require('url')
};

module.exports = function (config) {
    config = config || {};

    /**
    Initializes the request for further processing downstream.

    Parses out any query params along with the path, and sets up the
    `res.locals` namespace for the current request. Unnecessary within an
    express app, but necessary within a connect app.

    @param req {Object} Request.
    @param res {Object} Response.
    @param next {Function} Next.
    **/
    return function (req, res, next) {
        if (!req.query || !req.path) {
            // `true` enables query param parsing.
            var url = lib.url.parse(req.url, true);

            // Make parsed query params available downstream.
            req.query = url.query;

            // Make path available downstream.
            req.path = url.pathname;
        }

        // Initialize a namespace for the current request.
        res.locals = res.locals || {};

        next();
    };
};
